/**
 * Cloudflare Worker - HuggingFace API Proxy (SECURE VERSION)
 * Token wird als Cloudflare Secret gespeichert (nicht im Code!)
 * Frontend sendet nur inputs/parameters, KEIN Token
 */

export default {
  async fetch(request, env) {
    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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
      const { inputs, parameters } = body;

      // Check if HF_TOKEN secret is configured
      if (!env.HF_TOKEN) {
        return new Response(JSON.stringify({
          error: 'HF_TOKEN secret missing in Cloudflare Worker. Please configure it in Worker Settings → Variables.'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Validate inputs
      if (!inputs) {
        return new Response(JSON.stringify({
          error: 'Missing required field: inputs'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Forward to HuggingFace (Token kommt aus env.HF_TOKEN)
      // Trying legacy endpoint for private model access
      const hfResponse = await fetch('https://api-inference.huggingface.co/models/beko2210/Bel-KI-v1', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs,
          parameters: parameters || {}
        })
      });

      const text = await hfResponse.text();

      // Return response with CORS headers
      return new Response(text, {
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
