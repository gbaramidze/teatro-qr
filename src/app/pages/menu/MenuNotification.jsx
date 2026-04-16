'use client'

import {useEffect, useState} from 'react'
import {X} from 'lucide-react'
import Link from 'next/link'
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

// Removed hardcoded events and local parsing functions as we now fetch from the API


export default function MenuNotification() {
  const [eventToShow, setEventToShow] = useState()
  const [closed, setClosed] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const fetchEvents = async () => {
      try {
        const response = await fetch('https://teatro.ge/api/chatbot/events/');
        const data = await response.json();
        const apiEvents = data.events;

        const today = dayjs().startOf('day');
        const monthMap = {
          'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
          'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
        };

        for (const event of apiEvents) {
          let eventDate;
          const match = event.date.match(/(\d{1,2})\s+(\w+),\s+(\d{4})/);
          
          if (match) {
            const day = parseInt(match[1]);
            const monthName = match[2];
            const year = parseInt(match[3]);
            const month = monthMap[monthName];
            if (month !== undefined) {
              eventDate = dayjs(new Date(year, month, day)).startOf('day');
            }
          }

          if (!eventDate || !eventDate.isValid()) {
            eventDate = dayjs(event.date, 'dddd DD MMMM, YYYY HH:mm');
          }

          if (!eventDate || !eventDate.isValid()) continue;

          const showFrom = eventDate.subtract(14, 'day').startOf('day');
          const eventDay = eventDate.startOf('day');

          if ((today.isAfter(showFrom) || today.isSame(showFrom)) && today.isBefore(eventDay.add(1, 'day'))) {
            setEventToShow({
              ...event,
              avatar: event.image
            });
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [])

  if (!isClient || !eventToShow || closed) return null

  return (
    <div
      className="fixed bottom-6 left-4 right-4 max-w-sm mx-auto z-50 glass rounded-2xl shadow-2xl flex items-center gap-4 p-4 animate-fade-up animate-duration-500"
    >
      <div className="relative shrink-0">
        <img
          src={eventToShow.avatar}
          alt={eventToShow.title}
          className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500/30"
        />
        <div className="absolute inset-0 rounded-full shadow-inner shadow-black/40"></div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500 mb-1">Upcoming Event</h3>
        <p className="text-stone-100 text-sm font-bold truncate mb-1">
          {eventToShow.title}
        </p>
        <p className="text-stone-400 text-[10px] mb-2">
          {dayjs(eventToShow.date).format('dddd, MMMM D')}
        </p>
        <Link
          href={eventToShow.link}
          target="_blank"
          className="inline-flex items-center text-[10px] font-bold text-black bg-yellow-500 px-3 py-1 rounded-full hover:bg-yellow-400 transition-colors"
        >
          Book Now
        </Link>
      </div>
      
      <button
        onClick={() => setClosed(true)}
        className="text-stone-500 hover:text-stone-100 p-1 transition-colors"
        aria-label="Close notification"
      >
        <X size={18}/>
      </button>
    </div>
  )
}