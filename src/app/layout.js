import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { HotelAdminProvider } from "@/context/HotelAdminContext";
import { MembershipProvider } from "@/context/MembershipContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Staytion - Hotel Management",
  description: "Book your stay with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MembershipProvider>
            <HotelAdminProvider>
              {children}
              <Toaster position="top-right" />
            </HotelAdminProvider>
          </MembershipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
