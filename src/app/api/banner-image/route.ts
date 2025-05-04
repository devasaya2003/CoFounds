import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // Generate a random page number (1-10)
    const randomPage = Math.floor(Math.random() * 10) + 1;
    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
    
    // Get origin for CORS
    const origin = req.headers.get('origin');
    const isValidOrigin = origin && (
      origin === 'http://localhost:3000' ||
      origin.endsWith('.localhost:3000') || 
      origin.includes('cofounds')
    );
    
    // Fetch image from Pexels API
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=abstract+background&per_page=1&page=${randomPage}&size=large`,
      {
        headers: {
          Authorization: PEXELS_API_KEY || '',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    let result = { 
      url: null,
      photographer: null,
      photographerUrl: null
    };
    
    if (data.photos && data.photos.length > 0) {
      const photo = data.photos[0];
      // Use the original size for maximum quality
      result = {
        url: photo.src.original, // Use original for highest quality
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
      };
    }
    
    // Create response
    const nextResponse = NextResponse.json(result);
    
    // Add CORS headers
    if (isValidOrigin && origin) {
      nextResponse.headers.set('Access-Control-Allow-Origin', origin);
      nextResponse.headers.set('Access-Control-Allow-Methods', 'GET');
      nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    }
    
    return nextResponse;
  } catch (error) {
    console.error('Error fetching Pexels image:', error);
    const errorResponse = NextResponse.json({ 
      url: null, 
      photographer: null,
      photographerUrl: null
    }, { status: 500 });
    
    return errorResponse;
  }
}

export async function OPTIONS(req: Request) {
  // CORS preflight handler
  const origin = req.headers.get('origin');
  const isValidOrigin = origin && (
    origin === 'http://localhost:3000' ||
    origin.endsWith('.localhost:3000') || 
    origin.includes('cofounds')
  );
  
  const response = new NextResponse(null, { status: 204 });
  
  if (isValidOrigin && origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }
  
  return response;
}