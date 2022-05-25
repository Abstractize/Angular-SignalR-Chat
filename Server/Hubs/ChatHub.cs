using Microsoft.AspNetCore.SignalR;
using Server.Models;

namespace Server.Hubs
{
    public interface IChatHub
    {
        Task MessageRecieved(Message message);
    }
    public class ChatHub : Hub<IChatHub>
    {
        private static List<Message> Messages = new List<Message>();
        public override async Task OnConnectedAsync()
        {
            Messages.ForEach(async message =>
                await Clients.Caller.MessageRecieved(message));
            await base.OnConnectedAsync();
        }
        public async Task NewMessage(Message message)
        {
            Messages.Add(message);
            await Clients.All.MessageRecieved(message);
        }

    }
}