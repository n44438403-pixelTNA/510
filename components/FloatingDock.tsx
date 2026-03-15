import React, { useState } from 'react';
import { Youtube, FileText, CheckSquare, MessageCircle, Trophy, Gamepad2, History, Gift, ShoppingBag, Calendar, Settings, ChevronLeft, Home, Menu, X, Bot } from 'lucide-react';
import { StudentTab, ViewState, SystemSettings } from '../types';

interface Props {
    onTabSelect: (tab: StudentTab) => void;
    onGoHome: () => void;
    onGoBack: () => void;
    isStudent: boolean;
    settings?: SystemSettings;
}

export const FloatingDock: React.FC<Props> = ({ onTabSelect, onGoHome, onGoBack, isStudent, settings }) => {
    const [isMaximized, setIsMaximized] = useState(false);

    if (!isStudent) return null; 

    const menuItems: { id: StudentTab, icon: any, label: string, color: string }[] = [
        { id: 'AI_CHAT', icon: Bot, label: 'AI Tutor', color: 'text-indigo-600' },
        { id: 'VIDEO', icon: Youtube, label: 'Video', color: 'text-red-600' },
        { id: 'PDF', icon: FileText, label: 'Notes', color: 'text-blue-600' },
        { id: 'MCQ', icon: CheckSquare, label: 'MCQ', color: 'text-purple-600' },
        { id: 'LEADERBOARD', icon: Trophy, label: 'Rank', color: 'text-yellow-600' },
        { id: 'GAME', icon: Gamepad2, label: 'Game', color: 'text-orange-600' },
        { id: 'HISTORY', icon: History, label: 'History', color: 'text-slate-600' },
        { id: 'REDEEM', icon: Gift, label: 'Redeem', color: 'text-pink-600' },
        { id: 'STORE', icon: ShoppingBag, label: 'Store', color: 'text-blue-500' },
        { id: 'PROFILE', icon: Settings, label: 'Profile', color: 'text-indigo-600' },
    ].filter(item => {
        if (item.id === 'AI_CHAT' && settings?.isAiEnabled === false) return false;
        // 1. Global Content Visibility
        if (item.id === 'VIDEO' && settings?.contentVisibility?.VIDEO === false) return false;
        if (item.id === 'PDF' && settings?.contentVisibility?.PDF === false) return false;
        if (item.id === 'MCQ' && settings?.contentVisibility?.MCQ === false) return false;

        // 2. Granular Layout Visibility
        if (item.id === 'LEADERBOARD' && settings?.dashboardLayout?.['tile_leaderboard']?.visible === false) return false;
        if (item.id === 'GAME' && settings?.dashboardLayout?.['tile_game']?.visible === false) return false;
        if (item.id === 'HISTORY' && settings?.dashboardLayout?.['tile_history']?.visible === false) return false;
        if (item.id === 'REDEEM' && settings?.dashboardLayout?.['tile_redeem']?.visible === false) return false;
        if (item.id === 'STORE' && settings?.dashboardLayout?.['tile_premium']?.visible === false) return false;

        // 3. Existing Checks
        if (item.id === 'STORE' && settings?.isPaymentEnabled === false) return false;
        if (item.id === 'GAME' && settings?.isGameEnabled === false) return false;
        
        return true;
    });

    // Extract top 4 items for the bottom nav bar, rest go into the "More" menu
    const visibleItems = menuItems.slice(0, 4);
    const moreItems = menuItems.slice(4);

    return (
        <>
            {/* Flat Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-[9000] bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] max-w-md mx-auto">

                <button
                    onClick={() => { onGoHome(); }}
                    className="flex flex-col items-center justify-center w-16 p-1 text-slate-400 hover:text-blue-600 transition-colors active:scale-95"
                >
                    <Home size={22} className="mb-1" />
                    <span className="text-[9px] font-bold">Home</span>
                </button>

                {visibleItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => { onTabSelect(item.id); onGoHome(); }}
                        className="flex flex-col items-center justify-center w-16 p-1 text-slate-400 hover:text-blue-600 transition-colors active:scale-95"
                    >
                        <item.icon size={22} className={`mb-1 ${item.color.replace('text-', 'text-').replace('-600', '-500')}`} />
                        <span className="text-[9px] font-bold truncate w-full text-center">{item.label}</span>
                    </button>
                ))}

                <button 
                    onClick={() => setIsMaximized(true)}
                    className="flex flex-col items-center justify-center w-16 p-1 text-slate-400 hover:text-blue-600 transition-colors active:scale-95"
                >
                    <Menu size={22} className="mb-1" />
                    <span className="text-[9px] font-bold">More</span>
                </button>
            </div>

            {/* Maximized "More" Menu */}
            {isMaximized && (
                <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 animate-in fade-in">
                    <div className="absolute inset-0" onClick={() => setIsMaximized(false)}></div>

                    <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md mb-20 animate-in slide-in-from-bottom-10 border border-slate-100 relative z-10 mx-auto">
                        <button
                            onClick={() => setIsMaximized(false)}
                            className="absolute -top-4 -right-4 w-10 h-10 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Menu size={18} className="text-blue-600" /> All Options
                        </h3>

                        <div className="grid grid-cols-4 gap-4">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onTabSelect(item.id);
                                        onGoHome();
                                        setIsMaximized(false);
                                    }}
                                    className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors"
                                >
                                    <div className={`w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shadow-sm ${item.color}`}>
                                        <item.icon size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
