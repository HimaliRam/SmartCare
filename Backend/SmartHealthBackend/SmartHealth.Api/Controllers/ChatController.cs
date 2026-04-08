using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace SmartHealth.Api.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public ChatController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            var apiKey = "";

            // System rules
            var messages = new List<object>();

            messages.Add(new
            {
                role = "system",
                content = @"You are SmartCare AI Health Assistant.

STRICT RESPONSE RULES (MUST FOLLOW):
- Always respond in EXACTLY 3–4 short lines.
- Each line MUST be meaningful and complete.
- ALWAYS include emojis in every response (at least 2 emojis).
- Keep tone friendly, caring, and human-like.

RESPONSE FORMAT (MANDATORY):
1. First line: Empathy + problem understanding (with emoji)
2. Second line: Simple possible reason
3. Third line: What user should do (home remedy or advice)
4. Fourth line (optional but preferred): Doctor suggestion

MEDICAL RULES:
- Mild symptoms ? give simple home care tips
- Moderate symptoms ? suggest doctor specialization
- Emergency symptoms ? MUST say: 'Visit hospital immediately ??'

FORMATTING:
- Use line breaks after each sentence
- No long paragraphs
- No extra explanation
- Keep it short, clear, and impactful

IMPORTANT:
- Do NOT skip emojis ?
- Do NOT give long answers ?
- Do NOT combine lines ?

GOAL:
Make response look clean, modern, and easy to read like a chat message."
            });

            // Add conversation history
            foreach (var msg in request.Messages)
            {
                messages.Add(new
                {
                    role = msg.role,
                    content = msg.content
                });
            }

            var body = new
            {
                model = "llama-3.1-8b-instant",
                messages = messages,
                temperature = 0.4
            };

            var content = new StringContent(
                JsonSerializer.Serialize(body),
                Encoding.UTF8,
                "application/json"
            );

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            var response = await _httpClient.PostAsync(
                "",
                content
            );

            var result = await response.Content.ReadAsStringAsync();

            return Ok(JsonDocument.Parse(result).RootElement);
        }
    }

    public class ChatRequest
    {
        public List<ChatMessage> Messages { get; set; } = new();
    }

    public class ChatMessage
    {
        public string role { get; set; }
        public string content { get; set; }
    }
}