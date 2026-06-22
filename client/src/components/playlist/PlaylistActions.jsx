import React, { useState } from 'react';
import { RefreshCw, Download, Copy, Heart, Check } from 'lucide-react';
import Button from '../common/Button';
import { formatPlaylistForCopy, downloadPlaylistFile } from '../../utils/helpers';

export default function PlaylistActions({
  playlist,
  onGenerateAnother,
  isFavorite,
  onToggleFavorite
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const formatted = formatPlaylistForCopy(playlist);
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy playlist:', err);
    }
  };

  const handleDownload = () => {
    downloadPlaylistFile(playlist);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 w-full mt-8">
      {/* Save Playlist */}
      <Button
        onClick={onToggleFavorite}
        variant={isFavorite ? 'primary' : 'secondary'}
        icon={<Heart className="w-4.5 h-4.5" fill={isFavorite ? 'currentColor' : 'none'} />}
      >
        {isFavorite ? 'Saved in Favorites' : 'Save to Favorites'}
      </Button>

      {/* Copy Playlist */}
      <Button
        onClick={handleCopy}
        variant="secondary"
        icon={copied ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Copy className="w-4.5 h-4.5" />}
      >
        {copied ? 'Copied Details!' : 'Copy Details'}
      </Button>

      {/* Download Playlist */}
      <Button
        onClick={handleDownload}
        variant="secondary"
        icon={<Download className="w-4.5 h-4.5" />}
      >
        Download .txt
      </Button>

      {/* Generate Another */}
      <Button
        onClick={onGenerateAnother}
        variant="outline"
        icon={<RefreshCw className="w-4.5 h-4.5 animate-spin-hover" />}
      >
        Generate Another
      </Button>
    </div>
  );
}
