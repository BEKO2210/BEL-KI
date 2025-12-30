/**
 * Cloudflare Worker - HuggingFace Router Proxy (CHAT COMPLETIONS)
 * Token wird als Cloudflare Secret gespeichert (nicht im Code!)
 * Verwendet das neue Chat Completions API (OpenAI-kompatibel)
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
      console.log('Worker received body:', JSON.stringify(body, null, 2));

      const { messages, max_tokens, temperature, top_p } = body;

      // Check if HF_TOKEN secret is configured
      if (!env.HF_TOKEN) {
        return new Response(JSON.stringify({
          error: 'HF_TOKEN secret missing in Cloudflare Worker. Please configure it in Worker Settings → Variables.'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Validate messages
      if (!messages || !Array.isArray(messages)) {
        console.log('Validation failed - messages:', messages, 'isArray:', Array.isArray(messages));
        return new Response(JSON.stringify({
          error: 'Missing required field: messages (must be array)',
          debug: { received: body, messagesType: typeof messages, messagesValue: messages }
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Forward to HuggingFace Router (Chat Completions API)
      // Using Llama-3.2-3B-Instruct for testing (deployed, multilingual, works in German)
      const hfResponse = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.2-3B-Instruct',
          messages: messages,
          max_tokens: max_tokens || 512,
          temperature: temperature || 0.7,
          top_p: top_p || 0.9,
          stream: false
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
