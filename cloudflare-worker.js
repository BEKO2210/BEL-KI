/**
 * Cloudflare Worker - HuggingFace API Proxy
 * Löst CORS-Probleme für Browser-Anfragen
 */

export default {
  async fetch(request, env) {
    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      // Parse request body
      const body = await request.json();
      const { token, inputs, parameters } = body;

      // Validate token
      if (!token || !token.startsWith('hf_')) {
        return new Response(JSON.stringify({
          error: 'Invalid or missing HuggingFace token'
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Forward to HuggingFace
      const hfResponse = await fetch('https://api-inference.huggingface.co/models/beko2210/Bel-KI-v1', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs,
          parameters: parameters || {}
        })
      });

      const hfData = await hfResponse.json();

      // Return response with CORS headers
      return new Response(JSON.stringify(hfData), {
        status: hfResponse.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
  }
};
