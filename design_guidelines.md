# Lyzer Agent Design Guidelines
**AI-Powered LinkedIn Viral Post Generator**

## Design Approach
**Reference-Based**: Drawing from ChatGPT, Claude, Linear, and Gemini's modern AI chat interfaces. Focus on clean, conversation-first design that prioritizes content readability and intelligent interactions.

## Core Design Philosophy
Create a sophisticated, chat-first interface that feels like a premium AI tool. The design should communicate intelligence through restraint, precision through clean typography, and elegance through purposeful spacing.

## Layout Structure

**Primary Interface (Chat-First)**
- Full-height chat container with centered max-width constraint (max-w-3xl)
- Top navigation bar: Logo, session indicator, dark mode toggle (h-16)
- Main chat area: Auto-scrolling message feed with generous padding
- Bottom input area: Fixed position with backdrop blur, elevated above chat
- No traditional hero section - the chat interface IS the hero

**Spacing System**
Use Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm

## Typography Hierarchy

**Primary Font**: Inter or DM Sans via Google Fonts
**Secondary Font**: JetBrains Mono for any code snippets

- App Title/Logo: text-2xl font-bold
- Message Headers: text-sm font-semibold tracking-wide uppercase
- User Messages: text-base font-medium
- AI Responses: text-base leading-relaxed
- Metadata/Timestamps: text-xs opacity-70
- Input Placeholder: text-base opacity-50

## Component Specifications

**Navigation Bar**
- Sticky top with subtle border-bottom
- Contains: Logo/branding (left), Session ID pill (center), Dark mode toggle (right)
- Height: h-16 with px-6 horizontal padding

**Chat Messages**
- User messages: Aligned right, compact bubble design, max-w-2xl
- AI responses: Aligned left, full-width within container, includes copy button
- Message spacing: mb-6 between messages, mb-8 for AI responses
- Streaming effect: Typewriter animation for AI responses
- Include timestamp below each message (text-xs)

**Input Area**
- Fixed bottom with backdrop-blur-lg effect
- Textarea with auto-expand (max 4 lines before scroll)
- Send button integrated into input (absolute positioned right)
- Placeholder: "Describe the LinkedIn post you want to generate..."
- Padding: p-6 around container

**Action Buttons**
- Copy button: Small icon button (h-8 w-8) with hover tooltip
- Send button: Rounded-full with icon, disabled state when empty
- Success feedback: Brief checkmark animation on copy
- Dark mode toggle: Moon/sun icon with smooth transition

**Loading States**
- Skeleton screen for initial load: 3 message placeholders with pulsing animation
- AI thinking indicator: Animated dots or pulse in message bubble
- Input disabled state: Reduced opacity with visual feedback

**Status Indicators**
- Session pill: Subtle badge showing active session ID
- Connection status: Small indicator dot (online/offline)
- Character count: Subtle counter appearing on input focus

## Interaction Patterns

**Message Flow**
- User types → message appears instantly on right
- Brief loading state → AI response streams in character-by-character
- Smooth auto-scroll to latest message
- Copy-to-clipboard with visual confirmation (checkmark animation)

**Dark Mode**
- Toggle with smooth transition (transition-colors duration-200)
- System preference detection on first load
- Persistent preference in localStorage

**Responsive Behavior**
- Desktop (lg:): max-w-3xl centered chat, full features visible
- Tablet (md:): max-w-2xl, condensed navigation
- Mobile: Full width with px-4, stacked layout, bottom input remains fixed

## Visual Enhancements

**Micro-interactions**
- Button hover: Subtle scale transform (scale-105)
- Message entry: Slide-up animation with fade
- Copy success: Brief scale pulse on button
- Input focus: Ring highlight with brand accent

**Animations**
- Message appearance: fade-in-up (150ms)
- AI streaming: Typing cursor effect
- Loading states: Gentle pulse animation
- Dark mode transition: 200ms ease-in-out

**Surface Treatments**
- Navigation: Subtle border with slight elevation
- Input area: Frosted glass effect (backdrop-blur-lg)
- Messages: Distinct background treatment for user vs AI
- Hover states: Increased elevation or brightness

## Icon Library
**Heroicons** via CDN - use throughout for consistency
- Send: PaperAirplaneIcon
- Copy: ClipboardDocumentIcon
- Dark mode: MoonIcon / SunIcon
- Settings: CogIcon (if needed)

## Images
**No large hero image** - This is a chat-first interface where the conversation IS the experience. 

**Optional brand element**: Small illustrative graphic in empty state (before first message) showing LinkedIn logo or post preview mockup. Size: max-w-xs, centered, with subtle opacity.

## Accessibility
- Semantic HTML throughout (nav, main, section, article for messages)
- ARIA labels on all icon buttons
- Keyboard navigation: Tab through actions, Enter to send
- Focus indicators on all interactive elements
- Screen reader announcements for AI responses

## Production Readiness
- Error boundaries for API failures with retry UI
- Rate limiting feedback if applicable
- Empty state guidance before first message
- Clear call-to-action in initial view
- Session persistence warning on refresh
- Graceful degradation without JavaScript

**Key Insight**: This isn't a traditional landing page - it's a conversation tool. Design should get out of the way and let the AI-generated content shine while maintaining sophisticated polish through typography, spacing, and subtle interactions.