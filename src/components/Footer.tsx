"use client";
import { JoinCommunity } from "@/app/utils/joinCommunity";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <h2 className="text-xl font-display font-bold mb-4">Cofounds</h2>
            <p className="text-gray-600 max-w-md">
              Get hired based on your proof of work and community connections.
              Join our exclusive network of professionals.
            </p>
            <Button className="mt-6 bg-black text-white hover:bg-black/90"
            onClick={JoinCommunity}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Join Our WhatsApp Community
            </Button>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Sections</h3>
            <ul className="space-y-2">
              <li>
                <a href="#jobs" className="text-gray-600 hover:text-gray-900 text-sm">Jobs</a>
              </li>
              <li>
                <a href="#reviews" className="text-gray-600 hover:text-gray-900 text-sm">Reviews</a>
              </li>
              <li>
                <a href="#stories" className="text-gray-600 hover:text-gray-900 text-sm">Success Stories</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">About</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Cofounds. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://www.linkedin.com/company/cofounds/" className="text-gray-400 hover:text-gray-600">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
