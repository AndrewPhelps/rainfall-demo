import { NextRequest, NextResponse } from 'next/server'

// Real data from Rainfall API - MJ Jersey
const mockAssets = [
  {
    id: 'c501595e-4383-4e08-9868-d89888841941',
    name: 'Chicago Bulls Authentic Mitchell & Ness Michael Jordan 1995-96 Jersey',
    serial: 'EW3H-MRPQ',
    is_owner: false,
    merchant: {
      slug: 'main',
      name: 'Authentic',
      logo_light: 'https://media.rainf4ll.com/main_1612554908/merchants/e4501a746a75ca67a93881a923c40092a57d3a83bbcc82988e1b4fa1.png',
      logo_dark: null,
    },
    image_url: 'https://media.rainf4ll.com/main_1612554908/images/webp/60af47888d87e13f4051619590a00bdff945d15533090003db8f04df.webp',
    attributes: {
      brand: { name: 'Brand', value: 'Mitchell & Ness' },
      material: { name: 'Material', value: '100% Polyester' },
      description: {
        name: 'Description',
        value: 'Represent your team in this Chicago Bulls Michael Jordan Jersey! This Mitchell and Ness authentic 1995 Michael Jordan Jersey will let you show off the historic career of Michael Jordan.',
      },
    },
    featured_event: {
      id: 'caaed302-d16f-4cc2-9aa0-136360b9cf25',
      title: '🏀 RELIVE THE LEGACY OF MJ & THE \'96 BULLS',
      description: '<p><strong>🛍️ </strong><a target="_blank" rel="noopener noreferrer" href="https://shop.bulls.com/collections/michael-jordan-merchandise"><strong>Shop the MJ Collection</strong></a><strong> </strong>– Own all of the iconic Michael Jordan Authentic merch<br><a target="_blank" rel="noopener noreferrer" href="https://youtu.be/KwwUUXz-A3w?feature=shared"><strong>🎥 Watch Jordan\'s \'96 Highlights</strong></a><strong> </strong>– Relive peak MJ moments from the record-breaking season<br><a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/chicagobulls/"><strong>📸 Follow the Bulls on Instagram </strong></a>– See how fans honor greatness then and now<br><a target="_blank" rel="noopener noreferrer" href="https://www.unitedcenter.com/events/"><strong>🎟️ Visit the United Center</strong></a> – Experience the house that MJ built, live in Chicago<br><a target="_blank" rel="noopener noreferrer" href="https://www.nba.com/bulls/kidnation/bulls-kid-nation-programming"><strong>❤️ Support the Bulls Youth Hoops Program</strong></a> – Give back and inspire the next generation of legends</p>',
    },
    events: [
      {
        id: '3c7e0941-18d4-427d-8221-72cbdc71f423',
        title: 'MICHAEL JORDAN x MITCHELL & NESS JERSEY DROP',
        date: '2025-03-04T20:21:13-07:00',
        description: '<p>🗓️ Available Now<br>📍 <a target="_blank" rel="noopener noreferrer" href="https://shop.bulls.com/collections/michael-jordan-merchandise">Shop Official Store</a></p><p>🔥 Rep the legacy of the GOAT - Premium, iconic, and built for collectors and die-hards alike.</p>',
        address: 'United Center, Chicago, Illinois, United States',
        location: [-87.68643, 41.881165],
        images: [
          'https://media.rainf4ll.com/main_1612554908/images/webp/f3dbcfa347802c2fe58ff519817f683d67c5761f82a6fa9ab05211d5.webp',
          'https://media.rainf4ll.com/main_1612554908/images/webp/58565489f9815d10d871a21b27e91769c9c750817d752d4fb3b025cd.webp',
        ],
        video_file: null,
        video_link: '',
      },
      {
        id: '12c131a8-c9f1-4ff2-bf82-574d0567a245',
        title: '🥤 GATORADE PRESENTS: BE LIKE MIKE – FUELING THE FUTURE',
        date: '2025-02-04T20:09:31-07:00',
        description: '<p>Powered by Performance. Fueled by <strong>Gatorade.</strong></p>',
        address: 'United Center, Chicago, Illinois, United States',
        location: [-87.68643, 41.881165],
        images: ['https://media.rainf4ll.com/main_1612554908/images/webp/8dae6800e47aba920a30ae43aec0c3aaeef516d34f749e442b0472da.webp'],
        video_file: null,
        video_link: 'https://youtu.be/f7C5uYCiAs0?feature=shared',
      },
      {
        id: '8815aced-d0f3-4c41-9fdc-2a56f9e7c6e4',
        title: '📣 Hall of Fame Induction',
        date: '2009-09-11T19:02:29-07:00',
        description: '<p>Though the jersey represents his 1996 prime, the full arc of MJ\'s greatness was honored in his legendary Hall of Fame speech.</p>',
        address: 'Springfield, Massachusetts, United States',
        location: [-72.590561, 42.102635],
        images: ['https://media.rainf4ll.com/main_1612554908/images/webp/54e0240f53403ecdadf5d2243e294c3dd6b922bebfa34aa18b699d8b.webp'],
        video_file: null,
        video_link: 'https://youtu.be/-bDKq4O8bhc?feature=shared',
      },
      {
        id: 'ab8ad0b1-548b-4c1d-8c59-91e241e618fb',
        title: '👑 Game 1 – 1996 NBA Finals',
        date: '1996-06-05T18:55:43-07:00',
        description: '<p>Michael Jordan led the Bulls to a dominant Game 1 victory against the Seattle SuperSonics.</p>',
        address: 'United Center, Chicago, Illinois, United States',
        location: [-87.68643, 41.881165],
        images: ['https://media.rainf4ll.com/main_1612554908/images/webp/964ca5145f8f57c4a0d7fce27b5ea15c0ec23e5cf57ad2a1ebd085fe.webp'],
        video_file: null,
        video_link: 'https://www.youtube.com/watch?v=JhznfOR1hzY',
      },
      {
        id: 'e786c8c1-49a8-4e26-8f28-310f58178e02',
        title: '🏆 72-Win Season Tip-Off',
        date: '1995-11-03T19:52:21-07:00',
        description: '<p>The night it all began. MJ and the Bulls launched the 1995-96 season with a win over the Charlotte Hornets.</p>',
        address: 'United Center, Chicago, Illinois, United States',
        location: [-87.68643, 41.881165],
        images: [],
        video_file: null,
        video_link: 'https://youtu.be/WQpdz_98Blc?feature=shared',
      },
    ],
    verify_url: 'https://rainf4ll.com/details/6zxAj3pkVcmdp/',
    call_to_action: [],
    is_claimable: false,
    has_pin: false,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  // Simulate API response structure
  const paginatedResults = mockAssets.slice(offset, offset + limit)

  return NextResponse.json({
    count: mockAssets.length,
    next: null,
    previous: null,
    results: paginatedResults,
  })
}
