import React, { useEffect, useRef, useState } from "react";
import {
  FaChevronDown,
  FaPaperPlane,
  FaComments,
  FaPlus,
  FaXmark,
  FaUser,
  FaUsers,
  FaCheck,
} from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import useAuthStore from "../store/authStore";
import {
  getConversationDetailByID,
  getConversationsByUserID,
  createConversation,
  connectWebSocket,
  ChatWebSocket,
} from "../services/chatService";
import { searchUsers } from "../services/userService";
import { UserSearchItem } from "../types";

const Chat: React.FC = () => {
  const [isShowed, setIsShowed] = useState<boolean>(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [chatType, setChatType] = useState<"direct" | "group">("direct");
  const [conversationTitle, setConversationTitle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<UserSearchItem[]>([]);

  const user = useAuthStore((state) => state.user);

  const wsInstanceRef = useRef<ChatWebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      const currentUserId = user.id;
      try {
        const { data } = await getConversationsByUserID(Number(currentUserId));
        setConversations(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  // Debounced Search Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await searchUsers(searchQuery);
        const users: UserSearchItem[] = res.data?.data || res.data || [];
        const currentUserId = Number(user?.id);

        setSearchResults(
          users.filter((u: UserSearchItem) => Number(u.ID) !== currentUserId)
        );
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, user]);

  const handleSelectUser = (selectedUser: UserSearchItem) => {
    if (chatType === "direct") {
      setSelectedUsers([selectedUser]);
    } else {
      if (selectedUsers.some((u) => u.ID === selectedUser.ID)) {
        setSelectedUsers(selectedUsers.filter((u) => u.ID !== selectedUser.ID));
      } else {
        setSelectedUsers([...selectedUsers, selectedUser]);
      }
    }
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter((u) => u.ID !== userId));
  };

  const resetCreateForm = () => {
    setIsCreating(false);
    setSelectedUsers([]);
    setSearchQuery("");
    setSearchResults([]);
    setConversationTitle("");
    setChatType("direct");
  };

  const handleSelectConversation = async (currentID: number) => {
    try {
      const { data } = await getConversationDetailByID(currentID);
      setCurrentConversation(data);

      setMessages(data?.Messages || data?.messages || []);

      if (wsInstanceRef.current) {
        wsInstanceRef.current.close();
      }

      const currentUserId = user?.id;
      if (currentUserId) {
        wsInstanceRef.current = connectWebSocket(
          currentID,
          Number(currentUserId),
          (receivedMessage) => {
            setMessages((prev) => [...prev, receivedMessage]);
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUserId = user?.id;
    if (selectedUsers.length === 0 || !currentUserId || isSubmitting) return;

    if (chatType === "group" && !conversationTitle.trim()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        user_id: Number(currentUserId),
        participant_ids: selectedUsers.map((u) => u.ID),
        title: chatType === "group" ? conversationTitle.trim() : undefined,
      };

      const res = await createConversation(payload);
      const newConv = res?.data || res;

      if (newConv?.id || newConv?.ID) {
        const convID = newConv.id || newConv.ID;
        setConversations((prev) => [newConv, ...prev]);
        await handleSelectConversation(convID);
        resetCreateForm();
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (wsInstanceRef.current) {
        wsInstanceRef.current.close();
      }
    };
  }, []);

  const sendCurrentMessage = () => {
    const currentUserId = user?.id;
    if (
      wsInstanceRef.current &&
      newMessage.trim() !== "" &&
      currentConversation &&
      currentUserId
    ) {
      const payload = {
        conversation_id: currentConversation.id || currentConversation.ID,
        user_id: Number(currentUserId),
        text: newMessage.trim(),
      };

      wsInstanceRef.current.sendMessage(payload);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendCurrentMessage();
    }
  };

  return (
    <div className="fixed bottom-0 right-6 z-50">
      {isShowed ? (
        <div className="w-[420px] md:w-[680px] h-[520px] bg-white rounded-t-2xl border border-slate-200/80 shadow-2xl flex divide-x divide-slate-100 overflow-hidden transition-all duration-200 relative">
          
          {/* Modal / Overlay component for creating new chat */}
          {isCreating && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-20 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-xl border border-slate-100 flex flex-col max-h-[90%]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">Mulai Obrolan Baru</h3>
                  <button
                    onClick={resetCreateForm}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                  >
                    <FaXmark className="text-sm" />
                  </button>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setChatType("direct");
                      setSelectedUsers([]);
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                      chatType === "direct"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <FaUser className="text-[10px]" /> Private
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatType("group")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                      chatType === "group"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <FaUsers className="text-[10px]" /> Group
                  </button>
                </div>

                <form onSubmit={handleCreateConversation} className="flex flex-col gap-3 flex-1 overflow-hidden">
                  {chatType === "group" && (
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                        Nama Grup *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Diskusi Tim Alpha"
                        value={conversationTitle}
                        onChange={(e) => setConversationTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                      Cari Pengguna
                    </label>
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
                      <input
                        type="text"
                        placeholder="Cari berdasarkan username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Selected Users Pill List */}
                  {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
                      {selectedUsers.map((u) => (
                        <span
                          key={u.ID}
                          className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-medium px-2.5 py-1 rounded-full border border-indigo-100"
                        >
                          {u.Username}
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(u.ID)}
                            className="hover:text-indigo-900"
                          >
                            <FaXmark className="text-[10px]" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* User Search Results Section */}
                  <div className="flex-1 overflow-y-auto border border-slate-100 rounded-xl p-1 bg-slate-50/50 min-h-[140px]">
                    {isSearching ? (
                      <div className="p-4 text-center text-xs text-slate-400">Mencari...</div>
                    ) : searchResults.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {searchResults.map((u) => {
                          const isSelected = selectedUsers.some((sel) => sel.ID === u.ID);
                          return (
                            <div
                              key={u.ID}
                              onClick={() => handleSelectUser(u)}
                              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-indigo-50/80 border border-indigo-100 text-indigo-950"
                                  : "hover:bg-white text-slate-700 border border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                              {u.ProfilePicture ? (
                                <img
                                  src={u.ProfilePicture}
                                  alt={u.Username}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                                  <FaUser className="text-xs" />
                                </div>
                              )}
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-semibold text-slate-800 truncate">
                                  {u.Username}
                                </span>
                                <span className="text-[10px] text-slate-400 truncate">
                                  {u.Displayname || u.Email || `@${u.Username.toLowerCase()}`}
                                </span>
                              </div>
                              </div>
                              {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                  <FaCheck className="text-white text-[9px]" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : searchQuery ? (
                      <div className="p-4 text-center text-xs text-slate-400">Pengguna tidak ditemukan</div>
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">Ketik nama untuk mencari</div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={resetCreateForm}
                      className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        selectedUsers.length === 0 ||
                        (chatType === "group" && !conversationTitle.trim())
                      }
                      className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-xl transition-colors"
                    >
                      {isSubmitting ? "Membuat..." : "Buat Obrolan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Sidebar Chat List */}
          <div className="w-1/3 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaComments className="text-indigo-600 text-lg" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Obrolan</h2>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Mulai Obrolan Baru"
              >
                <FaPlus className="text-xs" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
              {conversations?.length ? (
                conversations.map((item: any) => {
                  const convID = item.id || item.ID;
                  const currentID = currentConversation?.id || currentConversation?.ID;
                  const isSelected = currentID === convID;

                  return (
                    <div
                      key={convID}
                      onClick={() => handleSelectConversation(convID)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-50/80 text-indigo-600 font-semibold"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item?.ProfilePicture ? (
                        <img
                          src={item?.ProfilePicture}
                          alt="avatar"
                          className="w-9 h-9 rounded-full object-cover border border-slate-200/60 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/60 text-slate-400 flex items-center justify-center shrink-0">
                          <FaUser className="text-xs" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs truncate ${isSelected ? "font-bold text-indigo-950" : "font-semibold text-slate-800"}`}>
                            {item?.title || item?.Title || "Obrolan"}
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item?.LastMessage || "Klik untuk membuka"}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 font-medium">
                  Belum ada percakapan.
                </div>
              )}
            </div>
          </div>

          {/* Main Messaging Area */}
          <div className="w-2/3 flex flex-col bg-white">
            <div className="p-3.5 px-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <h1 className="text-sm font-bold text-slate-900 truncate">
                  {currentConversation?.title || currentConversation?.Title || "Pilih Percakapan"}
                </h1>
              </div>
              <button
                onClick={() => setIsShowed(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Minimize Chat"
              >
                <FaChevronDown className="text-xs" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50/30">
              {currentConversation ? (
                messages.length ? (
                  messages.map((msg, index) => {
                    const currentUserId = user?.id;
                    const isMe = Number(msg?.user_id || msg?.UserID) === Number(currentUserId);
                    const messageContent = msg?.text || msg?.content || "";

                    return (
                      <div
                        key={index}
                        className={`flex gap-2.5 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}
                      >
                        {!isMe && (
                          <img
                            src="/assets/DefaultUser.png"
                            alt="avatar"
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-100"
                          />
                        )}
                        <div className={`flex flex-col gap-1 ${isMe ? "items-end" : ""}`}>
                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? "bg-indigo-600 text-white rounded-br-none shadow-sm"
                                : "bg-white text-slate-800 border border-slate-200/70 rounded-bl-none shadow-sm"
                            }`}
                          >
                            {messageContent}
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 px-1">
                            {msg?.time || "Baru saja"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                    Belum ada pesan. Mulai sapa temanmu!
                  </div>
                )
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                  Pilih salah satu obrolan di sebelah kiri.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-slate-100 bg-white">
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3.5 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-600 transition-all border border-transparent">
                <input
                  type="text"
                  placeholder="Tulis pesan..."
                  className="w-full bg-transparent text-xs text-slate-800 font-medium outline-none placeholder-slate-400"
                  value={newMessage}
                  disabled={!currentConversation}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={sendCurrentMessage}
                  disabled={!newMessage.trim() || !currentConversation}
                  className="p-1.5 text-indigo-600 disabled:text-slate-300 hover:bg-indigo-50 rounded-lg transition-colors shrink-0"
                >
                  <FaPaperPlane className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsShowed(true)}
          className="flex items-center justify-between gap-3 bg-white border border-slate-200/80 shadow-lg rounded-t-2xl px-5 py-3.5 text-slate-800 hover:text-indigo-600 hover:border-slate-300 transition-all duration-200 group cursor-pointer w-64"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm tracking-tight">temuka Chats</span>
          </div>
          <FaChevronDown className="text-xs text-slate-400 group-hover:text-indigo-600 group-hover:-translate-y-0.5 transition-all" />
        </button>
      )}
    </div>
  );
};

export default Chat;