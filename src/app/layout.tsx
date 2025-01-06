import React from 'react';

export default function RootLayout({
  children, // This will hold the page content
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Your App Title</title>
        {/* Add any other meta tags or global stylesheets here */}
      </head>
      <body>
        {children}
        {/* Add any other global components, like a footer */}
      </body>
    </html>
  );
}