"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Save, History, Calculator, TrendingUp, Star, X, Menu, ChevronRight, ChevronLeft, Settings, Trash, Edit, Plus, Check, Upload, Camera, Grid, Maximize2, Link } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MarketplaceIntegration from "./MarketplaceIntegration";
import CardGrading from "./CardGrading";

// Mock data for cards
const mockCards = [
  {
    id: 1,
    player: "Michael Jordan",
    year: "1986",
    product: "Fleer",
    cardNumber: "#57",
    sport: "Basketball",
    image: "/api/placeholder/300/400",
    ungradedValue: 5000,
    gradedValues: {
      "PSA 10": 150000,
      "PSA 9": 25000,
      "BGS 9.5": 35000,
      "SGC 10": 120000
    }
  },
  {
    id: 2,
    player: "LeBron James",
    year: "2003",
    product: "Topps Chrome",
    cardNumber: "#111",
    sport: "Basketball",
    image: "/api/placeholder/300/400",
    ungradedValue: 2000,
    gradedValues: {
      "PSA 10": 75000,
      "PSA 9": 15000,
      "BGS 9.5": 20000,
      "SGC 10": 60000
    }
  },
  {
    id: 3,
    player: "Mike Trout",
    year: "2011",
    product: "Topps Update",
    cardNumber: "#US175",
    sport: "Baseball",
    image: "/api/placeholder/300/400",
    ungradedValue: 800,
    gradedValues: {
      "PSA 10": 12000,
      "PSA 9": 3000,
      "BGS 9.5": 4500,
      "SGC 10": 10000
    }
  },
  {
    id: 4,
    player: "Tom Brady",
    year: "2000",
    product: "Bowman Chrome",
    cardNumber: "#236",
    sport: "Football",
    image: "/api/placeholder/300/400",
    ungradedValue: 3000,
    gradedValues: {
      "PSA 10": 85000,
      "PSA 9": 20000,
      "BGS 9.5": 30000,
      "SGC 10": 70000
    }
  },
  {
    id: 5,
    player: "Wayne Gretzky",
    year: "1979",
    product: "O-Pee-Chee",
    cardNumber: "#18",
    sport: "Hockey",
    image: "/api/placeholder/300/400",
    ungradedValue: 1500,
    gradedValues: {
      "PSA 10": 45000,
      "PSA 9": 12000,
      "BGS 9.5": 18000,
      "SGC 10": 40000
    }
  }
];

interface SavedSearch {
  id: string;
  name: string;
  criteria: SearchCriteria;
  timestamp: number;
}

interface SearchCriteria {
  player: string;
  year: string;
  product: string;
  cardNumber: string;
  sport: string;
}

interface GradingEvaluation {
  centering: number;
  corners: number;
  edges: number;
  surface: number;
}
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

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  side: 'front' | 'back';
}

export default function SportCardApp() {
  const [activeView, setActiveView] = useState<"search" | "grading" | "saved" | "marketplace" | "photo-grading">("search");
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    player: "",
    year: "",
    product: "",
    cardNumber: "",
    sport: ""
  });
  const [searchResults, setSearchResults] = useState<typeof mockCards>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [selectedCard, setSelectedCard] = useState<typeof mockCards[0] | null>(null);
  const [gradingEvaluation, setGradingEvaluation] = useState<GradingEvaluation>({
    centering: 5,
    corners: 5,
    edges: 5,
    surface: 5
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"value" | "year" | "player">("value");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [listingUrl, setListingUrl] = useState("");
  const [extractedImages, setExtractedImages] = useState<string[]>([]);
  const [isExtractingImages, setIsExtractingImages] = useState(false);
  const [photoTab, setPhotoTab] = useState<"upload" | "extract">("upload");

  // Load saved searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedSearches");
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  // Save searches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));
  }, [savedSearches]);

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const filtered = mockCards.filter(card => {
      const playerMatch = !searchCriteria.player || card.player.toLowerCase().includes(searchCriteria.player.toLowerCase());
      const yearMatch = !searchCriteria.year || card.year.includes(searchCriteria.year);
      const productMatch = !searchCriteria.product || card.product.toLowerCase().includes(searchCriteria.product.toLowerCase());
      const cardNumberMatch = !searchCriteria.cardNumber || card.cardNumber.toLowerCase().includes(searchCriteria.cardNumber.toLowerCase());
      const sportMatch = !searchCriteria.sport || card.sport === searchCriteria.sport;
      
      return playerMatch && yearMatch && productMatch && cardNumberMatch && sportMatch;
    });
    
    setSearchResults(filtered);
    setIsLoading(false);
    setCurrentPage(1);
  };

  const saveSearch = () => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: `${searchCriteria.player || "All Players"} - ${searchCriteria.year || "All Years"}`,
      criteria: { ...searchCriteria },
      timestamp: Date.now()
    };
    setSavedSearches([...savedSearches, newSearch]);
  };

  const loadSavedSearch = (search: SavedSearch) => {
    setSearchCriteria(search.criteria);
    setActiveView("search");
    handleSearch();
  };

  const deleteSavedSearch = (id: string) => {
    setSavedSearches(savedSearches.filter(s => s.id !== id));
  };

  const calculateEstimatedGrade = () => {
    const average = (gradingEvaluation.centering + gradingEvaluation.corners + gradingEvaluation.edges + gradingEvaluation.surface) / 4;
    if (average >= 9.5) return "9.5-10";
    if (average >= 8.5) return "8.5-9";
    if (average >= 7.5) return "7.5-8";
    return "Below 7.5";
  };

  const calculateROI = (cardValue: number, gradingCost: number, estimatedGrade: string) => {
    const gradeValue = estimatedGrade === "9.5-10" ? cardValue * 15 : 
                      estimatedGrade === "8.5-9" ? cardValue * 5 : 
                      cardValue * 2;
    return gradeValue - cardValue - gradingCost;
  };

  // Sort results
  const sortedResults = useMemo(() => {
    const sorted = [...searchResults];
    switch (sortBy) {
      case "value":
        return sorted.sort((a, b) => b.ungradedValue - a.ungradedValue);
      case "year":
        return sorted.sort((a, b) => parseInt(b.year) - parseInt(a.year));
      case "player":
        return sorted.sort((a, b) => a.player.localeCompare(b.player));
      default:
        return sorted;
    }
  }, [searchResults, sortBy]);

  // Paginate results
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedResults.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedResults, currentPage]);

  const totalPages = Math.ceil(sortedResults.length / itemsPerPage);
const [marketplaceSearchQuery, setMarketplaceSearchQuery] = useState("");
const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>(["ebay", "goldin", "pwcc"]);
const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>([]);
const [marketplaceSortBy, setMarketplaceSortBy] = useState<"price-low" | "price-high" | "ending-soon">("price-high");
// Photo grading states
const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
const [activeImage, setActiveImage] = useState<'front' | 'back'>('front');
const [showCenteringLines, setShowCenteringLines] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: UploadedImage = {
          id: Date.now().toString() + Math.random(),
          file,
          preview: e.target?.result as string,
          side: uploadedImages.length === 0 ? 'front' : 'back'
        };
        setUploadedImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    }
  });
};

const removeImage = (id: string) => {
  setUploadedImages(prev => prev.filter(img => img.id !== id));
};
const handleExtractImages = async () => {
  if (!listingUrl) return;
  
  setIsExtractingImages(true);
  
  // Simulate image extraction from listing
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock extracted images
  const mockExtractedImages = [
    "/api/placeholder/400/500",
    "/api/placeholder/400/500",
    "/api/placeholder/400/500",
    "/api/placeholder/400/500"
  ];
  
  setExtractedImages(mockExtractedImages);
  setIsExtractingImages(false);
};

const addExtractedImage = (imageUrl: string, side: 'front' | 'back') => {
  const newImage: UploadedImage = {
    id: Date.now().toString() + Math.random(),
    file: new File([], "extracted-image.jpg"),
    preview: imageUrl,
    side
  };
  setUploadedImages(prev => [...prev, newImage]);
  
  // Remove from extracted images
  setExtractedImages(prev => prev.filter(img => img !== imageUrl));
};
const currentImage = uploadedImages.find(img => img.side === activeImage);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-sm border-b border-blue-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Slablytics</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setActiveView("search")}
                className={`text-sm font-medium transition-colors ${
                  activeView === "search" ? "text-blue-400" : "text-gray-300 hover:text-white"
                }`}
              >
                Search Cards
              </button>
              <button
                onClick={() => setActiveView("grading")}
                className={`text-sm font-medium transition-colors ${
                  activeView === "grading" ? "text-blue-400" : "text-gray-300 hover:text-white"
                }`}
              >
                Grading Evaluation
              </button>
              <button
                onClick={() => setActiveView("saved")}
                className={`text-sm font-medium transition-colors ${
                  activeView === "saved" ? "text-blue-400" : "text-gray-300 hover:text-white"
                }`}
              >
                Saved Searches
              </button>
                <button
                onClick={() => setActiveView("marketplace")}
                className={`text-sm font-medium transition-colors ${
                  activeView === "marketplace" ? "text-blue-400" : "text-gray-300 hover:text-white"
                }`}
              >
                Marketplace
              </button>
              <button
                onClick={() => setActiveView("photo-grading")}
                className={`text-sm font-medium transition-colors ${
                  activeView === "photo-grading" ? "text-blue-400" : "text-gray-300 hover:text-white"
                }`}
              >
                Photo Grading
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden mt-4 space-y-2 overflow-hidden"
              >
                <button
                  onClick={() => {
                    setActiveView("search");
                    setShowMobileMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeView === "search" ? "bg-blue-500/20 text-blue-400" : "text-gray-300"
                  }`}
                >
                  Search Cards
                </button>
                <button
                  onClick={() => {
                    setActiveView("grading");
                    setShowMobileMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeView === "grading" ? "bg-blue-500/20 text-blue-400" : "text-gray-300"
                  }`}
                >
                  Grading Evaluation
                </button>
                <button
                  onClick={() => {
                    setActiveView("saved");
                    setShowMobileMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeView === "saved" ? "bg-blue-500/20 text-blue-400" : "text-gray-300"
                  }`}
                >
                  Saved Searches
                </button>
                  <button
                  onClick={() => setActiveView("marketplace")}
                  className={`text-sm font-medium transition-colors ${
                    activeView === "marketplace" ? "text-blue-400" : "text-gray-300 hover:text-white"
                  }`}
                >
                  Marketplace
                </button>
                 <button
                onClick={() => setActiveView("photo-grading")}
                className={`text-sm font-medium transition-colors ${
                  activeView === "photo-grading" ? "text-blue-400" : "text-gray-300 hover:text-white"
                }`}
              >
                Photo Grading
              </button>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Search View */}
          {activeView === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search Form */}
              <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20 mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Search Sports Cards</CardTitle>
                  <CardDescription className="text-gray-400">
                    Find market values for ungraded and graded cards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="player" className="text-gray-300">Player Name</Label>
                      <Input
                        id="player"
                        placeholder="e.g., Michael Jordan"
                        value={searchCriteria.player}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, player: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="year" className="text-gray-300">Card Year</Label>
                      <Input
                        id="year"
                        placeholder="e.g., 1986"
                        value={searchCriteria.year}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, year: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product" className="text-gray-300">Product/Set</Label>
                      <Input
                        id="product"
                        placeholder="e.g., Fleer"
                        value={searchCriteria.product}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, product: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber" className="text-gray-300">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="e.g., #57"
                        value={searchCriteria.cardNumber}
                        onChange={(e) => setSearchCriteria({ ...searchCriteria, cardNumber: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sport" className="text-gray-300">Sport</Label>
                      <Select value={searchCriteria.sport} onValueChange={(value) => setSearchCriteria({ ...searchCriteria, sport: value })}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select sport" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="All Sports">All Sports</SelectItem>
                          <SelectItem value="Basketball">Basketball</SelectItem>
                          <SelectItem value="Baseball">Baseball</SelectItem>
                          <SelectItem value="Football">Football</SelectItem>
                          <SelectItem value="Hockey">Hockey</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={handleSearch}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isLoading}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {isLoading ? "Searching..." : "Search Cards"}
                    </Button>
                    <Button 
                      onClick={saveSearch}
                      variant="outline"
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Search
                    </Button>
                    <Button 
                      onClick={() => setSearchCriteria({ player: "", year: "", product: "", cardNumber: "", sport: "" })}
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-slate-700/50"
                    >
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Results Section */}
              {searchResults.length > 0 && (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-white">
                      Search Results ({searchResults.length} cards found)
                    </h2>
                    <div className="flex items-center gap-4">
                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="value">Sort by Value</SelectItem>
                          <SelectItem value="year">Sort by Year</SelectItem>
                          <SelectItem value="player">Sort by Player</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Loading State */}
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-slate-800/50 rounded-lg p-4 animate-pulse">
                          <div className="w-full h-48 bg-slate-700/50 rounded mb-4"></div>
                          <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* Results Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedResults.map((card) => (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card 
                              className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer group"
                              onClick={() => setSelectedCard(card)}
                            >
                              <CardContent className="p-4">
                                <div className="aspect-[3/4] bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg mb-4 flex items-center justify-center group-hover:from-slate-600 group-hover:to-slate-700 transition-all">
                                  <span className="text-gray-500 text-sm">Card Image</span>
                                </div>
                                <h3 className="font-semibold text-white mb-1">{card.player}</h3>
                                <p className="text-sm text-gray-400 mb-3">
                                  {card.year} {card.product} {card.cardNumber}
                                </p>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Ungraded:</span>
                                    <span className="text-sm font-medium text-white">${card.ungradedValue.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">PSA 10:</span>
                                    <span className="text-sm font-medium text-green-400">${card.gradedValues["PSA 10"].toLocaleString()}</span>
                                  </div>
                                  <div className="pt-2 border-t border-slate-700">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">Potential Gain:</span>
                                      <span className="text-xs font-medium text-blue-400">
                                        +{((card.gradedValues["PSA 10"] / card.ungradedValue - 1) * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="border-slate-600 text-gray-400 hover:text-white hover:bg-slate-700/50"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <span className="text-sm text-gray-400 mx-4">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="border-slate-600 text-gray-400 hover:text-white hover:bg-slate-700/50"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {/* Empty State */}
              {!isLoading && searchResults.length === 0 && (
                <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
                  <CardContent className="py-12 text-center">
                    <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No cards found</h3>
                    <p className="text-gray-400">Try adjusting your search criteria or browse popular cards</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Grading Evaluation View */}
          {activeView === "grading" && (
            <motion.div
              key="grading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Condition Assessment */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">Card Condition Assessment</CardTitle>
                    <CardDescription className="text-gray-400">
                      Evaluate your card's condition to estimate its grade
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(gradingEvaluation).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-gray-300 capitalize">{key}</Label>
                          <span className="text-sm font-medium text-blue-400">{value}/10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={value}
                          onChange={(e) => setGradingEvaluation({
                            ...gradingEvaluation,
                            [key]: parseInt(e.target.value)
                          })}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {value >= 9 ? "Excellent" : value >= 7 ? "Very Good" : value >= 5 ? "Good" : "Fair"}
                        </p>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Estimated Grade Range:</span>
                        <span className="text-xl font-bold text-green-400">{calculateEstimatedGrade()}</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-gray-300 mb-2 block">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any other observations about your card..."
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* ROI Calculator */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">Grading ROI Calculator</CardTitle>
                    <CardDescription className="text-gray-400">
                      Calculate potential return on investment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentValue" className="text-gray-300">Current Card Value ($)</Label>
                      <Input
                        id="currentValue"
                        type="number"
                        placeholder="Enter current ungraded value"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gradingService" className="text-gray-300">Grading Service</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="psa">PSA ($30)</SelectItem>
                          <SelectItem value="bgs">BGS ($35)</SelectItem>
                          <SelectItem value="sgc">SGC ($25)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="turnaround" className="text-gray-300">Service Level</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select turnaround time" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="economy">Economy (120 days)</SelectItem>
                          <SelectItem value="regular">Regular (60 days)</SelectItem>
                          <SelectItem value="express">Express (20 days)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 border-t border-slate-700 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Estimated Grade:</span>
                        <span className="font-medium text-white">{calculateEstimatedGrade()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Grading Cost:</span>
                        <span className="font-medium text-white">$30</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Potential Value:</span>
                        <span className="font-medium text-green-400">$15,000</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                        <span className="text-gray-300 font-medium">Potential Profit:</span>
                        <span className="text-xl font-bold text-green-400">+$14,470</span>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Full Analysis
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Saved Searches View */}
          {activeView === "saved" && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Saved Searches</CardTitle>
                  <CardDescription className="text-gray-400">
                    Quick access to your frequently used searches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedSearches.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No saved searches yet</h3>
                      <p className="text-gray-400">Save a search from the search page to see it here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedSearches.map((search) => (
                        <div
                          key={search.id}
                          className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between group hover:bg-slate-700/70 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-white mb-1">{search.name}</h4>
                            <p className="text-sm text-gray-400">
                              {new Date(search.timestamp).toLocaleDateString()} at {new Date(search.timestamp).toLocaleTimeString()}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {search.criteria.player && (
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                  Player: {search.criteria.player}
                                </span>
                              )}
                              {search.criteria.year && (
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                  Year: {search.criteria.year}
                                </span>
                              )}
                              {search.criteria.sport && (
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                  Sport: {search.criteria.sport}
                                </span>
                              )}
                              {search.criteria.product && (
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                  Product: {search.criteria.product}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => loadSavedSearch(search)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            >
                              <Search className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteSavedSearch(search.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
          {/* Marketplace View - ADD IT HERE */}
        {activeView === "marketplace" && (
          <motion.div
            key="marketplace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MarketplaceIntegration />
          </motion.div>
        )}
              {/* Photo Grading View */}
                      {activeView === "photo-grading" && (
                        <motion.div
                          key="photo-grading"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Upload Section */}
                            <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
                              <CardHeader>
                                <CardTitle className="text-2xl text-white">Upload Card Photos</CardTitle>
                                <CardDescription className="text-gray-400">
                                  Upload front and back photos of your card for AI grading analysis
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors">
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                  />
                                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-300 mb-2">Drag and drop your card images here</p>
                                  <p className="text-sm text-gray-500 mb-4">or</p>
                                  <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Camera className="w-4 h-4 mr-2" />
                                    Select Photos
                                  </Button>
                                  <button
                                    onClick={() => setPhotoTab("extract")}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                      photoTab === "extract" 
                                        ? "bg-blue-600 text-white" 
                                        : "text-gray-400 hover:text-white hover:bg-slate-700/50"
                                    }`}
                                  >
                                    Extract from Listing
                                  </button>
                                </div>
                                {/* Extract from Listing Tab */}
                                  {photoTab === "extract" && (
                                    <div className="space-y-6">
                                      <div>
                                        <Label htmlFor="listingUrl" className="text-gray-300 mb-2 block">
                                          Listing URL
                                        </Label>
                                        <div className="flex gap-2">
                                          <Input
                                            id="listingUrl"
                                            type="url"
                                            placeholder="Paste eBay or other listing URL here..."
                                            value={listingUrl}
                                            onChange={(e) => setListingUrl(e.target.value)}
                                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                                          />
                                          <Button
                                            onClick={handleExtractImages}
                                            disabled={!listingUrl || isExtractingImages}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                          >
                                            <Link className="w-4 h-4 mr-2" />
                                            {isExtractingImages ? "Extracting..." : "Extract"}
                                          </Button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                          Supports eBay, COMC, PWCC, and other major card marketplaces
                                        </p>
                                      </div>

                                      {/* Extracted Images */}
                                      {extractedImages.length > 0 && (
                                        <div>
                                          <h4 className="text-sm font-medium text-gray-300 mb-3">
                                            Extracted Images ({extractedImages.length} found)
                                          </h4>
                                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {extractedImages.map((image, index) => (
                                              <div key={index} className="relative group">
                                                <div className="aspect-[3/4] bg-slate-700/50 rounded-lg overflow-hidden">
                                                  <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                                                    <span className="text-gray-500 text-sm">Image {index + 1}</span>
                                                  </div>
                                                </div>
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                                  <Button
                                                    size="sm"
                                                    onClick={() => addExtractedImage(image, 'front')}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                                  >
                                                    Use as Front
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    onClick={() => addExtractedImage(image, 'back')}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                                  >
                                                    Use as Back
                                                  </Button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Loading State */}
                                      {isExtractingImages && (
                                        <div className="text-center py-8">
                                          <div className="inline-flex items-center gap-2 text-gray-400">
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                            Extracting images from listing...
                                          </div>
                                        </div>
                                      )}

                                      {/* Empty State */}
                                      {!isExtractingImages && extractedImages.length === 0 && listingUrl && (
                                        <div className="text-center py-8">
                                          <p className="text-gray-400">No images extracted yet. Enter a listing URL and click Extract.</p>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                {/* Image Tabs */}
                                {uploadedImages.length > 0 && (
                                  <div className="space-y-4">
                                    <div className="flex gap-2">
                                      <Button
                                        variant={activeImage === 'front' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setActiveImage('front')}
                                        className={activeImage === 'front' 
                                          ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                          : "border-slate-600 text-gray-400 hover:text-white hover:bg-slate-700/50"
                                        }
                                      >
                                        Front
                                      </Button>
                                      <Button
                                        variant={activeImage === 'back' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setActiveImage('back')}
                                        className={activeImage === 'back' 
                                          ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                          : "border-slate-600 text-gray-400 hover:text-white hover:bg-slate-700/50"
                                        }
                                      >
                                        Back
                                      </Button>
                                    </div>

                                    {/* Image Preview */}
                                    {currentImage && (
                                      <div className="relative">
                                        <div className="relative aspect-[3/4] bg-slate-900 rounded-lg overflow-hidden">
                                          <img
                                            src={currentImage.preview}
                                            alt={`Card ${currentImage.side}`}
                                            className="w-full h-full object-contain"
                                          />

                                          {/* Centering Lines Overlay */}
                                          {showCenteringLines && (
                                            <div className="absolute inset-0 pointer-events-none">
                                              {/* Vertical center line */}
                                              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-500 opacity-70"></div>
                                              {/* Horizontal center line */}
                                              <div className="absolute top-1/2 left-0 right-0 h-px bg-red-500 opacity-70"></div>
                                              {/* Grid lines */}
                                              <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                                                {Array.from({ length: 100 }).map((_, i) => (
                                                  <div key={i} className="border border-red-500/20"></div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {/* Remove button */}
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            className="absolute top-2 right-2"
                                            onClick={() => removeImage(currentImage.id)}
                                          >
                                            <X className="w-4 h-4" />
                                          </Button>
                                        </div>

                                        {/* Analysis Controls */}
                                        <div className="flex gap-2 mt-4">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowCenteringLines(!showCenteringLines)}
                                            className="border-slate-600 text-gray-400 hover:text-white hover:bg-slate-700/50"
                                          >
                                            <Grid className="w-4 h-4 mr-2" />
                                            {showCenteringLines ? 'Hide' : 'Show'} Centering Lines
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-slate-600 text-gray-400 hover:text-white hover:bg-slate-700/50"
                                          >
                                            <Maximize2 className="w-4 h-4 mr-2" />
                                            Zoom
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Upload Tips */}
                                <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                                  <h4 className="text-sm font-medium text-white mb-2">Photo Tips for Best Results:</h4>
                                  <ul className="text-xs text-gray-400 space-y-1">
                                    <li>• Use good lighting without glare or shadows</li>
                                    <li>• Place card on a flat, contrasting background</li>
                                    <li>• Ensure the entire card is visible and in focus</li>
                                    <li>• Take photos straight on, not at an angle</li>
                                    <li>• Upload both front and back for complete analysis</li>
                                  </ul>
                                </div>
                              </CardContent>
                            </Card>

                      {/* Analysis Results Section */}
                      <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
                        <CardHeader>
                          <CardTitle className="text-2xl text-white">AI Grading Analysis</CardTitle>
                          <CardDescription className="text-gray-400">
                            Preliminary grade estimation based on photo analysis
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {uploadedImages.length === 0 ? (
                            <div className="text-center py-12">
                              <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                              <p className="text-gray-400">Upload card photos to begin analysis</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="bg-slate-700/30 rounded-lg p-4">
                                <p className="text-sm text-gray-400 text-center">
                                  Analysis will appear here once implemented
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )}
        </AnimatePresence>
      </main>

      {/* Selected Card Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedCard.player}</h2>
                    <p className="text-gray-400">
                      {selectedCard.year} {selectedCard.product} {selectedCard.cardNumber}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedCard(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-[3/4] bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Card Image</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Market Values</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                          <span className="text-gray-300">Ungraded</span>
                          <span className="font-medium text-white">${selectedCard.ungradedValue.toLocaleString()}</span>
                        </div>
                        {Object.entries(selectedCard.gradedValues).map(([grade, value]) => (
                          <div key={grade} className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                            <span className="text-gray-300">{grade}</span>
                            <span className="font-medium text-green-400">${value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Value Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Best ROI Grade:</span>
                          <span className="text-sm font-medium text-blue-400">PSA 10</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Max Potential:</span>
                          <span className="text-sm font-medium text-green-400">
                            +{((selectedCard.gradedValues["PSA 10"] / selectedCard.ungradedValue - 1) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        setSelectedCard(null);
                        setActiveView("grading");
                      }}
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Evaluate for Grading
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
      `}</style>
    </div>
  );
}

// END OF FILE