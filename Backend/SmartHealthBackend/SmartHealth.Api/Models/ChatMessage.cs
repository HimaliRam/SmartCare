public class ChatRequest
{
    public List<ChatMessage> Messages { get; set; } = new();
}

public class ChatMessage
{
    public string role { get; set; } = "";
    public string content { get; set; } = "";
}