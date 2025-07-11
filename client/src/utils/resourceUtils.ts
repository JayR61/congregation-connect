import { ChurchResource, ResourceBooking } from '@/types';

/**
 * Check if a resource is available for booking in a specified time period
 * @param resource The resource to check
 * @param bookings All existing bookings
 * @param startDate Start of the requested booking period
 * @param endDate End of the requested booking period
 * @returns Boolean indicating if the resource is available
 */
export const isResourceAvailable = (
  resource: ChurchResource,
  bookings: ResourceBooking[],
  startDate: Date,
  endDate: Date
): boolean => {
  // If resource is not in an available status, it can't be booked
  if (resource.status !== 'available') {
    return false;
  }
  
  // Check for existing approved or pending bookings that overlap with the requested period
  const conflictingBookings = bookings.filter(booking => {
    // Only consider bookings for this resource
    if (booking.resourceId !== resource.id) return false;
    
    // Only check approved and pending bookings
    if (!['approved', 'pending'].includes(booking.status)) return false;
    
    // Check for overlap
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    
    // Booking conflicts if:
    // 1. The new start is during the existing booking, or
    // 2. The new end is during the existing booking, or
    // 3. The new booking completely encompasses the existing one
    return (
      (startDate >= bookingStart && startDate < bookingEnd) || 
      (endDate > bookingStart && endDate <= bookingEnd) ||
      (startDate <= bookingStart && endDate >= bookingEnd)
    );
  });
  
  return conflictingBookings.length === 0;
};

/**
 * Format a resource booking period into a readable string
 * @param booking The booking to format
 * @returns Formatted date/time string
 */
export const formatBookingPeriod = (booking: ResourceBooking): string => {
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  
  // If dates are different, show full date range
  if (
    startDate.getDate() !== endDate.getDate() ||
    startDate.getMonth() !== endDate.getMonth() ||
    startDate.getFullYear() !== endDate.getFullYear()
  ) {
    return `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
            ${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Otherwise just show the date once with time range
  return `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
          ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

/**
 * Get upcoming bookings for a resource
 * @param resource The resource to check
 * @param bookings All bookings
 * @param limit Optional limit to the number of bookings to return
 * @returns Array of upcoming bookings for the resource
 */
export const getUpcomingBookings = (
  resource: ChurchResource, 
  bookings: ResourceBooking[],
  limit?: number
): ResourceBooking[] => {
  const now = new Date();
  
  const resourceBookings = bookings
    .filter(booking => 
      booking.resourceId === resource.id && 
      new Date(booking.endDate) >= now &&
      ['approved', 'pending'].includes(booking.status)
    )
    .sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  
  return limit ? resourceBookings.slice(0, limit) : resourceBookings;
};
