import re

with open('backend/src/main/java/com/quickcourt/quickcourt_backend/service/TimeSlotService.java', 'r') as f:
    text = f.read()

text = text.replace('private final UserRepository userRepository;', 'private final UserRepository userRepository;\n    private final com.quickcourt.quickcourt_backend.repository.BookingRepository bookingRepository;')

new_method = """
    @Transactional(readOnly = true)
    public List<TimeSlotResponse> getAvailableSlots(
            Long courtId,
            LocalDate date) {

        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new RuntimeException("Court not found"));

        LocalTime opening = LocalTime.parse(court.getOpeningTime());
        LocalTime closing = LocalTime.parse(court.getClosingTime());

        List<TimeSlot> blockedSlots = timeSlotRepository
                .findByCourtIdAndSlotDateOrderByStartTimeAsc(courtId, date).stream()
                .filter(s -> s.getStatus() == TimeSlot.SlotStatus.BLOCKED).toList();

        List<com.quickcourt.quickcourt_backend.entity.Booking> bookings = bookingRepository
                .findByCourtIdAndBookingDate(courtId, date).stream()
                .filter(b -> b.getStatus() != com.quickcourt.quickcourt_backend.entity.Booking.BookingStatus.CANCELLED).toList();

        java.util.List<TimeSlotResponse> available = new java.util.ArrayList<>();
        LocalTime current = opening;

        while (current.isBefore(closing)) {
            LocalTime next = current.plusHours(1);
            boolean isBlocked = false;

            for (TimeSlot blocked : blockedSlots) {
                if (current.isBefore(blocked.getEndTime()) && next.isAfter(blocked.getStartTime())) {
                    isBlocked = true;
                    break;
                }
            }

            for (com.quickcourt.quickcourt_backend.entity.Booking booking : bookings) {
                if (current.isBefore(booking.getEndTime()) && next.isAfter(booking.getStartTime())) {
                    isBlocked = true;
                    break;
                }
            }

            if (date.equals(LocalDate.now()) && current.isBefore(LocalTime.now())) {
                isBlocked = true;
            }

            if (!isBlocked) {
                TimeSlotResponse res = new TimeSlotResponse();
                res.setId((long) (current.getHour() * 100));
                res.setCourtId(courtId);
                res.setSlotDate(date);
                res.setStartTime(current);
                res.setEndTime(next);
                res.setStatus("AVAILABLE");
                available.add(res);
            }

            current = next;
        }

        return available;
    }
"""

text = re.sub(r'@Transactional\(readOnly = true\)\s+public List<TimeSlotResponse> getAvailableSlots\([\s\S]*?\.toList\(\);\s*\}', new_method, text)

with open('backend/src/main/java/com/quickcourt/quickcourt_backend/service/TimeSlotService.java', 'w') as f:
    f.write(text)
