import React, { useState } from 'react';

const COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500',
  'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
  'bg-teal-500', 'bg-gray-500', 'bg-emerald-500', 'bg-cyan-500'
];

const AddBookmarkModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    const favicon = `https://www.google.com/s2/favicons?domain=${new URL(formattedUrl).hostname}&sz=32`;
    onSave({
      id: Date.now(),
      name: name.trim(),
      title: name.trim(),
      url: formattedUrl,
      color,
      favicon,
      isCustom: true
    });
    setName('');
    setUrl('');
    setColor(COLORS[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Add Bookmark</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">URL</label>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Color</label>
            <div className="flex space-x-2">
              {COLORS.map(c => (
                <button type="button" key={c} className={`w-6 h-6 rounded ${c} ${color === c ? 'ring-2 ring-vyrnix-primary' : ''}`} onClick={() => setColor(c)} />
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-vyrnix-primary text-white rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookmarkModal; 