import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { getMessages, sendMessage, subscribeToMessages } from '../services/supabaseClient';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}

interface Props {
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
}

export const ChatBox: React.FC<Props> = ({ currentUserId, otherUserId, otherUserName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const subscription = subscribeToMessages(currentUserId, (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
      scrollToBottom();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUserId, otherUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await getMessages(currentUserId);
      if (!error && data) {
        const filtered = data.filter(
          (m) =>
            (m.sender_id === currentUserId && m.receiver_id === otherUserId) ||
            (m.sender_id === otherUserId && m.receiver_id === currentUserId)
        );
        setMessages(filtered);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setSending(true);
    try {
      const { error } = await sendMessage({
        sender_id: currentUserId,
        receiver_id: otherUserId,
        message: input,
      });
      if (!error) {
        setInput('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('فشل إرسال الرسالة');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center gap-2">
        <MessageCircle className="text-emerald-600" size={20} />
        <h3 className="font-black text-lg text-right flex-1">{otherUserName}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">جاري تحميل الرسائل...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">لا توجد رسائل بعد</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  msg.sender_id === currentUserId
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب رسالة..."
          className="flex-1 p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-200 text-right"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
