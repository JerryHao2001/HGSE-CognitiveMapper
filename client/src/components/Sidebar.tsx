import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { useMap } from '../context/MapContext';
import { generateNodesFromTopic, sendChatMessage } from '../lib/api';
import { ChevronLeft, ChevronRight, Send, Brain } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function Sidebar() {
  const { setInitialNodes, getMapState } = useMap();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      content: "Hello! I'm your cognitive mapping assistant. How can I help you develop your ideas today?",
      role: 'assistant'
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const { setInitialNodes } = useMap();
  const { toast } = useToast();

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleGenerateNodes = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Please enter a topic',
        description: 'Enter a topic or statement to generate nodes',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const nodes = await generateNodesFromTopic(topic);
      setInitialNodes(nodes);
      toast({
        title: 'Nodes generated',
        description: `Created ${nodes.length} nodes based on your topic`
      });
    } catch (error) {
      console.error('Failed to generate nodes:', error);
      toast({
        title: 'Generation failed',
        description: 'There was an error generating nodes from your topic',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: message,
      role: 'user'
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsSending(true);

    try {
      const { nodes, edges } = getMapState();
      const response = await sendChatMessage(message, { nodes, edges });
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        content: response,
        role: 'assistant'
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Message failed',
        description: 'There was an error sending your message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 flex flex-col z-10 shadow-md transition-all duration-300 overflow-hidden`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-crimson">AI Assistant</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 hover:text-crimson"
          onClick={toggleSidebar}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Topic Analysis Section */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="font-semibold mb-2 text-gray-700">Topic Analysis</h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter a topic or statement to generate initial nodes for your cognitive map.
        </p>
        
        <Textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent resize-none"
          rows={4}
          placeholder="E.g., Chinese government forces quarantine to prevent spread of COVID-19"
        />
        
        <Button 
          className="mt-3 w-full py-2 bg-crimson text-white rounded hover:bg-crimson/90 transition flex items-center justify-center space-x-2"
          onClick={handleGenerateNodes}
          disabled={isGenerating}
        >
          <Brain className="h-4 w-4" />
          <span>{isGenerating ? 'Generating...' : 'Generate Nodes'}</span>
        </Button>
      </div>
      
      {/* Chat Section */}
      <div className="flex-1 flex flex-col overflow-hidden p-4">
        <h3 className="font-semibold mb-2 text-gray-700">Chat Assistant</h3>
        <div 
          id="chat-messages" 
          ref={chatMessagesRef}
          className="flex-1 overflow-y-auto mb-4 space-y-4"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start ${
                msg.role === 'user' ? 'justify-end' : ''
              }`}
            >
              <div 
                className={`rounded-lg p-3 max-w-xs ${
                  msg.role === 'user' 
                    ? 'bg-crimson text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex items-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-crimson focus:border-transparent"
            placeholder="Ask something..."
            disabled={isSending}
          />
          <Button 
            className="p-3 bg-crimson text-white rounded hover:bg-crimson/90 transition"
            onClick={handleSendMessage}
            disabled={isSending || !message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Collapsed sidebar button */}
      {!sidebarOpen && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 left-0 bg-white border border-gray-200 shadow-sm rounded-r-md rounded-l-none h-10"
          onClick={toggleSidebar}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
