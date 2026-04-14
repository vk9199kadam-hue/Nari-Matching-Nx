import { Share2, Link as LinkIcon, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ShareButtonProps {
  productName: string
  productUrl?: string
}

export function ShareButton({ productName, productUrl }: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const url = productUrl || window.location.href

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: productName, text: `Check out ${productName} on Nari Matching Nx!`, url })
      } catch { /* user cancelled */ }
    } else {
      setOpen(!open)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
    setOpen(false)
  }

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${productName} on Nari Matching Nx! ${url}`)}`, '_blank')
    setOpen(false)
  }

  return (
    <div className="relative">
      <button onClick={handleShare} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors">
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-elevated p-2 z-20 animate-fade-in">
          <button onClick={copyLink} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-card-foreground hover:bg-secondary rounded-md transition-colors">
            <LinkIcon className="h-4 w-4" /> Copy Link
          </button>
          <button onClick={shareWhatsApp} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-card-foreground hover:bg-secondary rounded-md transition-colors">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
        </div>
      )}
    </div>
  )
}
