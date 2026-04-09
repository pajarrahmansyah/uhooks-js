export const metadata = {
  title: "uhooks-js Demo",
  description: "Testing uhooks-js hooks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          backgroundColor: "#f5f5f5",
        }}
      >
        {children}
      </body>
    </html>
  );
}
