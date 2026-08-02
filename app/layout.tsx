import './globals.css'

export const metadata = {
  title: 'Retro PS1 Donate',
  description: 'Insert Coin to Donate',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="crt min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        {children}
      </body>
    </html>
  )
}
