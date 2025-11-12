import { NextRequest, NextResponse } from 'next/server';
import { proxyStreamUrl, proxyApiCall } from '@/lib/axiosProxy';

// Type guard for axios errors
interface AxiosError {
  response?: {
    status: number;
  };
}

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, Referer, User-Agent',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Proxy GET requests untuk stream
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    const responseType = searchParams.get('type') || 'stream';
    
    if (!targetUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Decode URL jika ter-encode
    const decodedUrl = decodeURIComponent(targetUrl);
    
    console.log('Proxying URL:', decodedUrl);

    let response;
    
    if (responseType === 'json' || responseType === 'text') {
      // Untuk API calls yang return JSON/text
      response = await proxyApiCall(decodedUrl);
      
      return NextResponse.json(response.data, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': response.headers['content-type'] || 'application/json',
        },
      });
    } else {
      // Untuk stream (video, audio, dll)
      response = await proxyStreamUrl(decodedUrl);
      
      // Stream response langsung ke client
      const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers['content-type'] || 'application/octet-stream',
        'Content-Length': response.headers['content-length'] || '',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
      });

      // Jika ada range request, forward ke target
      const range = request.headers.get('range');
      if (range) {
        headers.set('Content-Range', response.headers['content-range'] || '');
        return new NextResponse(response.data, {
          status: 206,
          headers,
        });
      }

      return new NextResponse(response.data, {
        status: response.status,
        headers,
      });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = isAxiosError(error) ? error.response?.status || 500 : 500;
    console.error('Stream proxy error:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Failed to proxy stream',
        details: errorMessage,
        url: request.url
      },
      { 
        status: statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}

// Proxy POST requests
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    
    if (!targetUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    const decodedUrl = decodeURIComponent(targetUrl);
    const body = await request.json().catch(() => null);
    
    console.log('Proxying POST to:', decodedUrl);

    const response = await proxyApiCall(decodedUrl, {
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return NextResponse.json(response.data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = isAxiosError(error) ? error.response?.status || 500 : 500;
    console.error('POST proxy error:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Failed to proxy POST request',
        details: errorMessage
      },
      { 
        status: statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}