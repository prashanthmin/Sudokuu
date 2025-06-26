import React from 'react';
import { Star, Calendar, Clock, ThumbsUp } from 'lucide-react';
import { Button } from './ui/button';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <img
        src={movie.poster_url}
        alt={movie.title}
        className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <h3 className="text-white font-semibold text-lg">{movie.title}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{movie.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{movie.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{movie.duration}</span>
            </div>
          </div>
          <div className="text-sm text-gray-300">{movie.genre}</div>
          <p className="text-sm text-gray-300 line-clamp-3">{movie.description}</p>
          <Button size="sm" className="mt-2">
            <ThumbsUp className="w-4 h-4 mr-2" /> Add to Watchlist
          </Button>
        </div>
      </div>
    </div>
  );
}