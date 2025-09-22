"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, TrendingUp, Clock, DollarSign, AlertCircle, ExternalLink, Shield, Star } from "lucide-react";

interface MarketplaceListing {
  id: string;
  marketplace: string;
  title: string;
  price: number;
  currency: string;
  condition?: string;
  grade?: string;
  grader?: string;
  auctionEnd?: string;
  imageUrl?: string;
  listingUrl: string;
  bids?: number;
  watchers?: number;
  saleType: "auction" | "buy-now" | "best-offer";
}

interface MarketplaceConfig {
  name: string;
  id: string;
  color: string;
  icon: React.ReactNode;
  available: boolean;
  requiresAuth: boolean;
  description: string;
}

const MARKETPLACES: MarketplaceConfig[] = [
  {
    name: "eBay",
    id: "ebay",
    color: "bg-yellow-500",
    icon: <DollarSign className="w-4 h-4" />,
    available: true,
    requiresAuth: false,
    description: "World's largest online marketplace"
  },
  {
    name: "Goldin",
    id: "goldin",
    color: "bg-purple-600",
    icon: <Shield className="w-4 h-4" />,
    available: true,
    requiresAuth: false,
    description: "Premium sports card auction house"
  },
  {
    name: "PWCC",
    id: "pwcc",
    color: "bg-blue-600",
    icon: <Star className="w-4 h-4" />,
    available: true,
    requiresAuth: false,
    description: "Premier auction house for trading cards"
  },
  {
    name: "COMC",
    id: "comc",
    color: "bg-green-600",
    icon: <TrendingUp className="w-4 h-4" />,
    available: true,
    requiresAuth: false,
    description: "Check Out My Cards marketplace"
  },
  {
    name: "MySlabs",
    id: "myslabs",
    color: "bg-red-600",
    icon: <Shield className="w-4 h-4" />,
    available: true,
    requiresAuth: false,
    description: "Graded card marketplace"
  },
  {
    name: "Alt",
    id: "alt",
    color: "bg-indigo-600",
    icon: <Star className="w-4 h-4" />,
    available: false,
    requiresAuth: true,
    description: "Alternative asset investment platform"
  }
];

// Mock data for different marketplaces
const generateMockListings = (marketplace: string, query: string): MarketplaceListing[] => {
  const mockData: Record<string, MarketplaceListing[]> = {
    ebay: [
      {
        id: "eb1",
        marketplace: "eBay",
        title: `${query} - PSA 10 Gem Mint`,
        price: 15000,
        currency: "USD",
        condition: "Graded",
        grade: "10",
        grader: "PSA",
        auctionEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        listingUrl: "https://ebay.com/sample",
        bids: 24,
        saleType: "auction"
      }
    ],
    goldin: [
      {
        id: "g1",
        marketplace: "Goldin",
        title: `${query} Premium Auction - PSA 9`,
        price: 8500,
        currency: "USD",
        condition: "Graded",
        grade: "9",
        grader: "PSA",
        auctionEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        listingUrl: "https://goldin.co/sample",
        bids: 18,
        watchers: 145,
        saleType: "auction"
      },
      {
        id: "g2",
        marketplace: "Goldin",
        title: `${query} Elite Collection BGS 9.5`,
        price: 12000,
        currency: "USD",
        condition: "Graded",
        grade: "9.5",
        grader: "BGS",
        listingUrl: "https://goldin.co/sample2",
        saleType: "buy-now"
      }
    ],
    pwcc: [
      {
        id: "p1",
        marketplace: "PWCC",
        title: `${query} - Weekly Auction PSA 10`,
        price: 14500,
        currency: "USD",
        condition: "Graded",
        grade: "10",
        grader: "PSA",
        auctionEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        listingUrl: "https://pwcc.com/sample",
        bids: 31,
        saleType: "auction"
      }
    ],
    comc: [
      {
        id: "c1",
        marketplace: "COMC",
        title: `${query} Raw Near Mint`,
        price: 2500,
        currency: "USD",
        condition: "Near Mint",
        listingUrl: "https://comc.com/sample",
        saleType: "buy-now"
      },
      {
        id: "c2",
        marketplace: "COMC",
        title: `${query} PSA 8`,
        price: 4200,
        currency: "USD",
        condition: "Graded",
        grade: "8",
        grader: "PSA",
        listingUrl: "https://comc.com/sample2",
        saleType: "best-offer"
      }
    ],
    myslabs: [
      {
        id: "m1",
        marketplace: "MySlabs",
        title: `${query} SGC 10 Gold Label`,
        price: 11000,
        currency: "USD",
        condition: "Graded",
        grade: "10",
        grader: "SGC",
        listingUrl: "https://myslabs.com/sample",
        saleType: "buy-now"
      }
    ]
  };

  return mockData[marketplace] || [];
};

export default function MarketplaceIntegration() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>(["ebay", "goldin", "pwcc"]);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "ending-soon">("price-high");

  const fetchMarketplaceData = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    if (selectedMarketplaces.length === 0) {
      setError("Please select at least one marketplace");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API calls to different marketplaces
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let allListings: MarketplaceListing[] = [];
      
      for (const marketplace of selectedMarketplaces) {
        const marketplaceListings = generateMockListings(marketplace, searchQuery);
        allListings = [...allListings, ...marketplaceListings];
      }
      
      // Sort listings based on selected criteria
      const sortedListings = [...allListings].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "ending-soon":
            if (!a.auctionEnd && !b.auctionEnd) return 0;
            if (!a.auctionEnd) return 1;
            if (!b.auctionEnd) return -1;
            return new Date(a.auctionEnd).getTime() - new Date(b.auctionEnd).getTime();
          default:
            return 0;
        }
      });
      
      setListings(sortedListings);
    } catch (err) {
      setError("Failed to fetch marketplace data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMarketplace = (marketplaceId: string) => {
    setSelectedMarketplaces(prev => 
      prev.includes(marketplaceId) 
        ? prev.filter(id => id !== marketplaceId)
        : [...prev, marketplaceId]
    );
  };

  const getMarketplaceConfig = (marketplaceId: string) => {
    return MARKETPLACES.find(m => m.id === marketplaceId);
  };

  const calculatePriceRange = () => {
    if (listings.length === 0) return { min: 0, max: 0, avg: 0 };
    const prices = listings.map(l => l.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((a, b) => a + b, 0) / prices.length
    };
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-xl text-white">Multi-Marketplace Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div>
            <Label htmlFor="marketplaceSearch" className="text-gray-300">Search All Marketplaces</Label>
            <Input
              id="marketplaceSearch"
              placeholder="e.g., 2003 LeBron James Topps Chrome"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && fetchMarketplaceData()}
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Marketplace Selection */}
          <div>
            <Label className="text-gray-300 mb-2 block">Select Marketplaces</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {MARKETPLACES.map((marketplace) => (
                <button
                  key={marketplace.id}
                  onClick={() => marketplace.available && toggleMarketplace(marketplace.id)}
                  disabled={!marketplace.available}
                  className={`
                    p-3 rounded-lg border transition-all
                    ${selectedMarketplaces.includes(marketplace.id) 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-slate-600 bg-slate-700/30'
                    }
                    ${marketplace.available 
                      ? 'hover:border-blue-400 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className={`w-2 h-2 rounded-full ${marketplace.color}`}></div>
                    {marketplace.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">{marketplace.name}</div>
                    <div className="text-xs text-gray-400">
                      {marketplace.available ? marketplace.description : "Coming Soon"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="sortBy" className="text-gray-300">Sort Results By</Label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-6">
              <Button 
                onClick={fetchMarketplaceData} 
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? "Searching..." : "Search All"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {listings.length > 0 && (
        <>
          {/* Price Summary */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
            <CardContent className="py-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-400">Lowest Price</div>
                  <div className="text-xl font-bold text-green-400">
                    ${calculatePriceRange().min.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Average Price</div>
                  <div className="text-xl font-bold text-blue-400">
                    ${calculatePriceRange().avg.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Highest Price</div>
                  <div className="text-xl font-bold text-purple-400">
                    ${calculatePriceRange().max.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Listings */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Found {listings.length} Listings Across {selectedMarketplaces.length} Marketplaces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listings.map((listing) => {
                  const marketplace = getMarketplaceConfig(listing.marketplace.toLowerCase());
                  return (
                    <div key={listing.id} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-32 bg-slate-600 rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
                          Card Image
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-white font-medium text-sm mb-1">{listing.title}</h4>
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${marketplace?.color}`}></div>
                                <span className="text-xs text-gray-400">{listing.marketplace}</span>
                                {listing.saleType === "auction" && (
                                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                                    Auction
                                  </span>
                                )}
                                {listing.saleType === "buy-now" && (
                                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                                    Buy Now
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-400">
                                ${listing.price.toLocaleString()}
                              </div>
                              {listing.bids && (
                                <div className="text-xs text-gray-400">{listing.bids} bids</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                              {listing.grade && (
                                <span className="text-blue-400">
                                  {listing.grader} {listing.grade}
                                </span>
                              )}
                              {listing.condition && !listing.grade && (
                                <span className="text-gray-400">{listing.condition}</span>
                              )}
                              {listing.auctionEnd && (
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span className="text-xs">
                                    {new Date(listing.auctionEnd).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              {listing.watchers && (
                                <span className="text-xs text-gray-500">
                                  {listing.watchers} watching
                                </span>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                              onClick={() => window.open(listing.listingUrl, "_blank")}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}