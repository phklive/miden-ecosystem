'use client';

import React, { useState, ChangeEvent, useMemo } from 'react';

interface Project {
  id: number;
  name: string;
  description: string;
  link: string;
  imageUrl: string;
  tags: string[];
}

const allProjects: Project[] = [
  {
    id: 1,
    name: 'Miden Name Service',
    description: 'A decentralized naming system for the Miden ecosystem.',
    link: 'https://miden-name-service-p55kix6fq-paulhenryks-projects.vercel.app/',
    imageUrl: 'miden_name_service.png',
    tags: ['Naming', 'Utility', 'Infrastructure']
  },

];

// --- Helper function to get unique tags ---
const getAllUniqueTags = (projects: Project[]): string[] => {
  const tagSet = new Set<string>();
  projects.forEach(project => {
    project.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};


// --- The Page Component ---
export default function MidenEcosystemPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const uniqueTags = useMemo(() => getAllUniqueTags(allProjects), []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags(prevSelectedTags => {
      const newSelectedTags = new Set(prevSelectedTags);
      if (newSelectedTags.has(tag)) {
        newSelectedTags.delete(tag);
      } else {
        newSelectedTags.add(tag);
      }
      return newSelectedTags;
    });
  };

  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const activeTags = Array.from(selectedTags);

    return allProjects.filter(project => {
      const matchesSearch = term === '' ||
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.tags.some(tag => tag.toLowerCase().includes(term));

      const matchesTags = activeTags.length === 0 ||
        activeTags.every(selectedTag =>
          project.tags.some(projectTag => projectTag.toLowerCase() === selectedTag.toLowerCase())
        );

      return matchesSearch && matchesTags;
    });
  }, [searchTerm, selectedTags]);

  return (
    // --- UPDATED: Background uses gradient, removed style attribute ---
    <main
      className="min-h-screen text-white p-8 md:p-16 bg-gradient-to-br from-gray-900 via-purple-950 to-black" // Example gradient: Dark Gray -> Deep Purple -> Black
    >
      {/* Content wrapper */}
      <div className="container mx-auto relative z-10">

        {/* Main Title */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-center mb-10 text-white drop-shadow-lg">
          Miden Ecosystem
        </h1>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full max-w-xl px-5 py-3 bg-gray-900 bg-opacity-80 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 shadow-md"
          />
        </div>

        {/* Tag Filter Buttons */}
        <div className="mb-12 flex justify-center flex-wrap gap-2 px-4">
          {uniqueTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition duration-200 ease-in-out border ${selectedTags.has(tag)
                ? 'bg-purple-600 text-white border-purple-500 hover:bg-purple-700'
                : 'bg-gray-700 bg-opacity-70 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white'
                }`}
            >
              {tag}
            </button>
          ))}
          {selectedTags.size > 0 && (
            <button
              onClick={() => setSelectedTags(new Set())}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition duration-200 ease-in-out border border-red-500 text-red-300 hover:bg-red-500 hover:text-white"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Project Widgets Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProjects.map((project) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                // Slightly updated card style for modern look
                className="group flex flex-col bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/70 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden hover:shadow-purple-600/50 transform hover:-translate-y-1.5 transition-all duration-300 ease-in-out border border-gray-700/50 hover:border-purple-500/80"
              >
                <img
                  src={project.imageUrl}
                  alt={`${project.name} visual representation`}
                  className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none'; // Hide broken images gracefully
                  }}
                />
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    {project.name}
                  </h2>
                  <p className="text-gray-300 mb-4 text-sm flex-grow">
                    {project.description}
                  </p>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3 mt-auto">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-700/80 text-gray-300 px-2.5 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="text-blue-400 group-hover:text-blue-300 text-sm font-medium inline-flex items-center mt-2 self-start">
                    Visit Project →
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          // --- MODIFIED: No projects found message - Box removed ---
          <div className="text-center text-gray-400 mt-16 py-10">
            <p className="text-2xl mb-2 font-semibold">No projects found</p>
            <p>Try adjusting your search or clearing tag filters.</p>
            {(searchTerm || selectedTags.size > 0) && (
              <button
                onClick={() => { setSelectedTags(new Set()); setSearchTerm(''); }}
                className="mt-4 px-4 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out border border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
