'use client'

import {useEffect, useState} from 'react'
import {X} from 'lucide-react'
import Link from 'next/link'
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const events = [
  {
    date: '2025-07-19',
    title: 'DJ Smash',
    promo: 'queen',
    avatar: 'https://prestastorage90158-staging.s3.eu-central-1.amazonaws.com/images/teatro/1750169857965_smash.jpg',
    link: 'https://teatro.ge/event/dj-smash',
  },
  {
    date: '2025-08-02',
    title: 'Morandi',
    promo: 'angels',
    avatar: 'https://prestastorage90158-staging.s3.eu-central-1.amazonaws.com/images/teatro/1750170198059_morandi.jpg',
    link: 'https://teatro.ge/event/morandi',
  },
  {
    date: '2025-08-09',
    title: 'DJ Nejtrino',
    promo: 'angels',
    avatar: 'https://teatro.ge/_next/image/?url=https%3A%2F%2Fprestastorage90158-staging.s3.eu-central-1.amazonaws.com%2Fimages%2Fteatro%2F1753998090941_8399341.jpg&w=640&q=90',
    link: 'https://teatro.ge/event/dj-nejtrino',
  },
  {
    date: '2025-08-16',
    title: 'Gunwest',
    promo: 'angels',
    avatar: 'https://teatro.ge/_next/image/?url=https%3A%2F%2Fprestastorage90158-staging.s3.eu-central-1.amazonaws.com%2Fimages%2Fteatro%2F1754244998226_poster.jpg&w=640&q=90',
    link: 'https://teatro.ge/event/gunwest',
  },
  {
    date: '2025-08-23',
    title: 'Misha Miller',
    promo: 'teatro50',
    avatar: 'https://prestastorage90158-staging.s3.eu-central-1.amazonaws.com/images/teatro/1750170774799_misha.jpg',
    link: 'https://teatro.ge/event/misha-miller',
  },
  {
    date: '2025-09-05',
    title: 'Burak Yeter',
    promo: 'angels',
    avatar: 'https://teatro.ge/_next/image/?url=https%3A%2F%2Fprestastorage90158-staging.s3.eu-central-1.amazonaws.com%2Fimages%2Fteatro%2F1753998564147_1.jpg&w=640&q=90',
    link: 'https://teatro.ge/event/burak-yeter',
  },
]

function parseLocalDate(dateStr, add = 0) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day + add)
}

function formatDate(dateStr) {
  const date = parseLocalDate(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export default function MenuNotification() {
  const [eventToShow, setEventToShow] = useState(events[0])
  const [closed, setClosed] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    console.log('Today (local):', today.toString())
    console.log('Today (ISO):', today.toISOString())

    for (const event of events) {
      try {
        const eventDate = parseLocalDate(event.date)
        eventDate.setHours(0, 0, 0, 0)

        const showFrom = new Date(eventDate)
        showFrom.setDate(eventDate.getDate() - 14)
        showFrom.setHours(0, 0, 0, 0)

        console.log(`Checking event: ${event.title}`)
        console.log('Event Date (local):', eventDate.toString())
        console.log('Show From (local):', showFrom.toString())

        if (today >= showFrom && today < eventDate) {
          console.log(`Event "${event.title}" should be shown`)
          setEventToShow(event)
          break
        }
      } catch (error) {
        console.error(`Error processing event ${event.title}:`, error)
      }
    }
  }, [])

  if (!isClient || !eventToShow || closed) return null

  return (
    <div
      className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50 bg-black text-white p-4 rounded-2xl shadow-lg flex items-start gap-4">
      <img
        src={eventToShow.avatar}
        alt={eventToShow.title}
        className="w-16 h-16 rounded-full object-cover object-top"
      />
      <div className="flex-1">
        <h2>Teatro - presents</h2>
        <p className="text-sm font-medium">
          {dayjs(eventToShow.date).format('dddd, DD MMMM, YYYY')} – <strong>{eventToShow.title}</strong>
        </p>
        <Link
          href={eventToShow.link}
          target="_blank"
          className="text-blue-400 text-sm hover:underline"
        >
          View event →
        </Link>
      </div>
      <button
        onClick={() => setClosed(true)}
        className="text-gray-400 hover:text-white"
        aria-label="Close notification"
      >
        <X size={20}/>
      </button>
    </div>
  )
}