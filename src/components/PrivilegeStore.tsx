import React, { useState } from 'react';
import { useRoom } from '../context/RoomContext';
import { Shield, Music, Film, Utensils, AlertTriangle, Coins, Sparkles, Plus, Ticket, ShoppingBag } from 'lucide-react';

interface StoreItem {
  name: string;
  cost: number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const PrivilegeStore: React.FC = () => {
  const { currentRoom, activeMemberId, purchaseVoucher, redeemVoucher, addCustomVoucher } = useRoom();

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customCost, setCustomCost] = useState(50);

  const members = currentRoom?.members || [];
  const activeMember = members.find(m => m.id === activeMemberId);
  const vouchers = currentRoom?.vouchers || [];
  const customTemplates = currentRoom?.customVouchers || [];

  // Vouchers owned by the logged-in roommate
  const myVouchers = vouchers.filter(v => v.memberId === activeMemberId);
  const activeMyVouchers = myVouchers.filter(v => v.status === 'Active');

  // Vouchers redeemed by ANY roommate (to show feed)
  const allRedeemedVouchers = vouchers
    .filter(v => v.status === 'Redeemed')
    .sort((a, b) => (b.redeemedTimestamp || 0) - (a.redeemedTimestamp || 0))
    .slice(0, 3);

  // Standard Catalog
  const baseStoreItems: StoreItem[] = [
    {
      name: 'Dishwashing Shield',
      cost: 100,
      description: 'Skip dishwashing duty once. Pass it back to the spinner pool.',
      icon: <Shield size={16} />,
      color: '#047857' // Emerald green ink
    },
    {
      name: 'DJ Music Choice',
      cost: 50,
      description: 'Choose the music playlist during the next car ride.',
      icon: <Music size={16} />,
      color: '#0369a1' // Cyan blue ink
    },
    {
      name: 'Movie Night Curator',
      cost: 75,
      description: 'Choose the movie for our next group movie night.',
      icon: <Film size={16} />,
      color: '#6d28d9' // Purple ink
    },
    {
      name: 'Takeout Decider',
      cost: 150,
      description: 'Get the final vote on what restaurant takeout to order.',
      icon: <Utensils size={16} />,
      color: '#be185d' // Pink ink
    },
    {
      name: 'Trash Pass',
      cost: 60,
      description: 'Pass your trash duty to a random roommate.',
      icon: <AlertTriangle size={16} />,
      color: '#b45309' // Orange ink
    }
  ];

  // Merge standard catalog with user created templates
  const customStoreItems: StoreItem[] = customTemplates.map(t => ({
    name: t.name,
    cost: t.cost,
    description: t.description,
    icon: <Ticket size={16} />,
    color: '#475569' // grey graphite
  }));

  const storeItems = [...baseStoreItems, ...customStoreItems];

  const getMemberName = (id: string) => {
    const m = members.find(mem => mem.id === id);
    return m ? `(${m.avatar}) ${m.name}` : 'Roommate';
  };

  const handleBuy = (item: StoreItem) => {
    if (!activeMember || activeMember.points < item.cost) return;
    purchaseVoucher(item.name, item.cost);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    addCustomVoucher(customName.trim(), customCost, customDescription.trim());
    
    setCustomName('');
    setCustomDescription('');
    setCustomCost(50);
    setIsAddingCustom(false);
  };

  return (
    <div className="store-card card glass-card" style={{ transform: 'rotate(-0.5deg)' }}>
      {/* Scotch Tape Header overlay */}
      <div className="sticky-tape-header" style={{ transform: 'rotate(-1deg)', background: 'rgba(253, 253, 226, 0.45)' }}></div>

      <div className="card-header flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-header flex items-center gap-2 text-indigo-900">
            <Ticket size={18} className="text-indigo-600 animate-pulse" />
            Coupon Store
          </h2>
          <p className="text-xs text-slate-500 font-header">Tear out reward coupons using points</p>
        </div>
        
        {activeMember ? (
          <div className="user-points-badge font-header flex items-center gap-0.5 bg-amber-50 border-2 border-amber-300 text-amber-900 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
            <Coins size={12} />
            <span>{activeMember.points} pts</span>
          </div>
        ) : (
          <div className="text-[10px] text-slate-400 font-header italic">No roommate selected</div>
        )}
      </div>

      <div className="store-content flex flex-col gap-4">
        {/* Custom coupon builder trigger */}
        {activeMember && (
          <div className="flex justify-end">
            <button
              onClick={() => setIsAddingCustom(!isAddingCustom)}
              className="btn-sketch btn-blue py-1 px-2.5 text-[10px] rounded cursor-pointer"
            >
              {isAddingCustom ? 'Cancel' : <><Plus size={10} /> Pin Custom Coupon</>}
            </button>
          </div>
        )}

        {/* Custom Coupon Builder form */}
        {isAddingCustom && (
          <form onSubmit={handleCreateCustom} className="coupon-builder-cork glass-card mb-2 animate-fadeIn">
            <h3 className="text-[11px] font-bold font-header text-amber-900 mb-2 flex items-center gap-1">
              <Plus size={11} className="text-amber-700 animate-pulse" /> Pin Custom Reward Coupon
            </h3>
            
            <div className="form-group mb-2">
              <label className="form-label text-[9px]">Coupon Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Wash Coffee Mugs"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div className="form-group mb-2">
              <label className="form-label text-[9px]">Description</label>
              <textarea
                placeholder="Rachel will wash all coffee mugs on Sunday night..."
                value={customDescription}
                onChange={e => setCustomDescription(e.target.value)}
                className="form-input text-xs h-10 resize-none"
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label text-[9px]">Points Cost</label>
              <input
                type="number"
                min={10}
                max={500}
                required
                value={customCost}
                onChange={e => setCustomCost(parseInt(e.target.value) || 0)}
                className="form-input text-xs"
              />
            </div>

            <button type="submit" className="w-full btn-sketch btn-green py-1 text-[10px] font-bold font-header cursor-pointer">
              PIN TO BULLETIN BOARD
            </button>
          </form>
        )}

        {/* Coupon Catalog - perforated coupon stubs */}
        <div className="store-catalog flex flex-col gap-2.5 max-h-[220px] overflow-y-scroll pr-1">
          {storeItems.map(item => {
            const canAfford = activeMember ? activeMember.points >= item.cost : false;
            
            return (
              <div key={item.name} className="coupon-stub flex justify-between items-center transition-transform hover:translate-x-1">
                <div className="flex gap-3 items-center flex-1 pl-4">
                  <div className="store-item-icon p-1.5 rounded" style={{ background: item.color + '12', color: item.color, border: `1.5px solid ${item.color}` }}>
                    {item.icon}
                  </div>
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold font-header text-slate-800 flex items-center gap-1.5 flex-wrap">
                      {item.name}
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-300 px-1 rounded font-header">
                        {item.cost} pts
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
                  </div>
                </div>

                <button
                  disabled={!activeMember || !canAfford}
                  onClick={() => handleBuy(item)}
                  className={`btn-sketch py-1 px-2.5 text-[9px] font-bold font-header shrink-0 cursor-pointer ${
                    canAfford ? 'btn-green' : 'bg-slate-100 text-slate-400 border-slate-300 opacity-60 shadow-none cursor-not-allowed'
                  }`}
                >
                  TEAR
                </button>
              </div>
            );
          })}
        </div>

        {/* Roommate's Coupon book */}
        {activeMember && (
          <div className="inventory-section border-t border-dashed border-slate-300 pt-3">
            <h3 className="text-xs font-bold font-header text-indigo-900 mb-2 uppercase tracking-wide flex items-center gap-1">
              <ShoppingBag size={12} className="text-indigo-600" />
              My Coupon Booklet ({activeMyVouchers.length} active)
            </h3>
            
            {activeMyVouchers.length === 0 ? (
              <div className="p-3 text-center text-slate-500 text-[10px] font-header border border-dashed border-slate-300 rounded bg-white italic">
                You have no active coupons in your booklet. Tear one above!
              </div>
            ) : (
              <div className="inventory-scrollable-container max-h-[160px] overflow-y-scroll pr-1">
                <div className="inventory-grid grid grid-cols-2 gap-2">
                  {activeMyVouchers.map(v => (
                    <div key={v.id} className="inventory-item glass-card p-2 flex flex-col justify-between gap-2.5 bg-white">
                      {/* Cork staple pins */}
                      <div className="cork-staple-header"></div>
                      <div className="text-[10px] font-bold font-header text-slate-800 line-clamp-1 text-center mt-1">{v.name}</div>
                      <button
                        onClick={() => redeemVoucher(v.id)}
                        className="w-full btn-sketch btn-blue py-1 text-[9px] font-bold font-header rounded flex justify-center items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Sparkles size={9} /> Rip Coupon
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Global redemption history ledger */}
        {allRedeemedVouchers.length > 0 && (
          <div className="redemption-feed-section border-t border-dashed border-slate-300 pt-3">
            <h4 className="text-[10px] font-bold font-header text-slate-400 mb-1.5 uppercase tracking-wider">
              RIP LOGS
            </h4>
            <div className="flex flex-col gap-1.5">
              {allRedeemedVouchers.map(v => (
                <div key={v.id} className="p-2 bg-slate-50 border border-slate-300 rounded text-[10px] font-header flex justify-between items-center text-slate-700">
                  <div className="flex items-center gap-1.5 truncate">
                    <Ticket size={10} className="text-indigo-500 shrink-0" />
                    <span>
                      <span className="font-bold text-slate-900">{getMemberName(v.memberId)}</span>
                      <span> ripped a </span>
                      <span className="text-indigo-800 font-bold">"{v.name}"</span>
                      <span> coupon!</span>
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-semibold shrink-0 ml-2">
                    {new Date(v.redeemedTimestamp || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
