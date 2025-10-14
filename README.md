# Is This Meme - Fullscreen Video with Text Overlays

A fullscreen video meme website with random text overlays that fade in at different positions on the screen.

## Features

- Fullscreen video background (looping, no controls)
- Random text overlays that fade in at different positions
- 10 different positioning options:
  - Top: left, center, right, right-quarter
  - Middle: left, center, right  
  - Bottom: left, center, right
- Configurable timing and content
- Smooth fade-in/fade-out animations

## Files

- `index.html` - Main HTML structure
- `style.css` - CSS for fullscreen video and overlay positioning
- `config.js` - Configuration for overlay content and timing
- `script.js` - JavaScript for overlay management and animations
- `assets/is_this_meme.mp4` - Your meme video file

## Configuration

Edit `config.js` to customize:

### Overlay Content
Add or modify overlay objects in the `overlays` array:
```javascript
{
    type: 'text',           // 'text' or 'image'
    content: 'Your text',   // Text content or image URL
    position: 'top-left',   // Position (see available positions)
    duration: 3000          // Display duration in milliseconds
}
```

### Timing
Adjust the interval range between overlays:
```javascript
intervalRange: {
    min: 2000,  // Minimum 2 seconds
    max: 5000   // Maximum 5 seconds
}
```

### Available Positions
- `top-left`, `top-center`, `top-right`, `top-right-quarter`
- `middle-left`, `middle-center`, `middle-right`
- `bottom-left`, `bottom-center`, `bottom-right`

## Controls

- **Spacebar**: Manually trigger a random overlay
- **R**: Restart the overlay system
- **C**: Clear all current overlays

## Usage

1. Place your video file in the `assets/` folder
2. Update the video source in `index.html` if needed
3. Customize overlays in `config.js`
4. Open `index.html` in a web browser
5. Enjoy your meme with random text overlays!

## Adding Images

To add image overlays, use:
```javascript
{
    type: 'image',
    content: 'path/to/your/image.jpg',
    position: 'middle-center',
    duration: 4000
}
```

The system supports both text and image overlays, and you can mix them in the configuration array.
