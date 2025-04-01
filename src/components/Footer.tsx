"use client"
import { MessageSquare } from "lucide-react"
import { FaLinkedin } from 'react-icons/fa';
import { Button } from "@/components/ui/button"
import { JoinCommunity } from "@/app/utils/joinCommunity";
import { GoToLinkedIn } from "@/app/utils/goToLinkedIn";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container py-12 px-8">
        {/* Grid */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="md:max-w-md">
            <h2 className="text-xl font-display font-bold mb-4">Cofounds</h2>
            <p className="text-gray-600">
              Get hired based on your proof of work and community connections. Join our exclusive network of
              professionals.
            </p>
            <Button className="mt-6 bg-black text-white hover:bg-black/90" onClick={JoinCommunity}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Join Our WhatsApp Community
            </Button>
            <Button
              className="mt-2 bg-blue-700 text-white hover:bg-blue-800 flex items-center justify-center px-4 rounded-md"
              onClick={GoToLinkedIn}
            >
              <FaLinkedin className="h-5 w-3 mr-2" />
              LinkedIn
            </Button>
          </div>

          <div className="md:text-right">
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

