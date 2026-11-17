/**
 * Starts one of our own <video> players, with sound when the browser allows it.
 * Browsers only allow sound after the visitor has interacted with the page (and iPhones only from inside the tap itself),
 * so when play() with sound is refused the video starts muted instead and `onMuted(true)` shows an unmute button.
 */
export function startPlayback(video: HTMLVideoElement, onMuted: (muted: boolean) => void) {
  video.muted = false;
  onMuted(false);
  video.play().catch((err: unknown) => {
    if (err instanceof DOMException && err.name === 'AbortError') return; // a newer load or pause took over
    video.muted = true;
    onMuted(true);
    video.play().catch(() => {
      // Still refused (e.g. Low Power Mode): the poster and the play button stay, so a tap can try again.
    });
  });
}
