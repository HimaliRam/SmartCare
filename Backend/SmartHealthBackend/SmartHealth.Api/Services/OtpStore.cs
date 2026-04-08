using System;
using System.Collections.Concurrent;

namespace SmartHealth.Api.Services
{
    public static class OtpStore
    {
        public static ConcurrentDictionary<string, OtpEntry> OtpData
            = new ConcurrentDictionary<string, OtpEntry>();
    }

    public class OtpEntry
    {
        public string Otp { get; set; }
        public DateTime Expiry { get; set; }
    }
}