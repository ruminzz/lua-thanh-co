(() => {
  "use strict";
  const c = window.INVITATION_CONFIG || {};
  const $ = id => document.getElementById(id);
  const set = (id, value) => { if (value != null && $(id)) $(id).textContent = value; };

  const titleEl = $("event-title");
  if (titleEl && c.eventTitle) {
    if (c.eventTitle.trim().toUpperCase() === "LỬA THÀNH CỔ") {
      titleEl.innerHTML = "LỬA<br><span>THÀNH CỔ</span>";
    } else {
      titleEl.textContent = c.eventTitle;
    }
  }

  set("cover-kicker", c.coverKicker);
  set("cover-pretitle", c.coverPretitle);
  set("cover-tagline", c.coverTagline);
  set("cover-date", c.dateShort);
  set("letter-kicker", c.letterKicker);
  set("letter-heading", c.letterHeading || "Lời hiệu triệu từ Thành Cổ");
  set("greeting", c.greeting);
  set("intro", c.intro);
  set("meaning-title", c.meaningTitle);
  set("meaning", c.meaning);
  set("quote", c.quote);
  set("event-time", c.time);
  set("event-place", c.place);
  set("closing-title", c.closingTitle);
  set("closing-copy", c.closing);
  set("signature", c.signature);
  set("footer-title", c.eventTitle);
  set("footer-note", c.footerNote);

  const mapEl = $("event-map");
  if (mapEl && c.mapImage) mapEl.src = c.mapImage;

  const timelineBox = $("timeline-box");
  const timelineEl = $("event-timeline");
  if (timelineBox && timelineEl) {
    if (c.timelineImage) {
      timelineEl.src = c.timelineImage;
    } else {
      timelineBox.style.display = "none";
    }
  }

  const layer = $("letter-layer");
  const sheet = $("letter-sheet");
  const grip = $("sheet-grip");
  const audio = $("background-music");
  let opened = false, startY = 0, lastY = 0, dragging = false;

  if (c.music) audio.src = c.music;

  function openLetter() {
    if (opened) return;
    opened = true;
    layer.classList.add("is-open");
    layer.setAttribute("aria-hidden", "false");
    document.body.classList.add("letter-open");
    sheet.scrollTop = 0;
    if (c.music) audio.play().catch(() => {});
  }
  function closeLetter() {
    if (!opened) return;
    opened = false;
    layer.classList.remove("is-open");
    layer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("letter-open");
  }
  $("open-letter").addEventListener("click", openLetter);
  $("close-letter").addEventListener("click", closeLetter);
  $("letter-backdrop").addEventListener("click", closeLetter);

  // Cho phép người xem thực sự vuốt/kéo tờ thư từ cạnh dưới lên.
  grip.addEventListener("pointerdown", e => {
    dragging = true; startY = e.clientY; lastY = e.clientY;
    grip.setPointerCapture(e.pointerId);
    sheet.classList.add("dragging");
  });
  grip.addEventListener("pointermove", e => {
    if (!dragging) return;
    lastY = e.clientY;
    const distance = Math.max(0, startY - lastY);
    if (!opened && distance > 55) openLetter();
    if (opened && lastY - startY > 100) closeLetter();
  });
  const stopDrag = () => { dragging = false; sheet.classList.remove("dragging"); };
  grip.addEventListener("pointerup", stopDrag);
  grip.addEventListener("pointercancel", stopDrag);

  $("sound-toggle").addEventListener("click", async () => {
    if (!c.music) {
      $("sound-toggle").title = "Thêm đường dẫn file nhạc trong config.js để bật nhạc";
      return;
    }
    if (audio.paused) {
      try {
        await audio.play();
        $("sound-toggle").classList.add("playing");
      } catch (_) {
        $("sound-toggle").title = "Chưa tìm thấy file âm thanh trong thư mục music/";
      }
    } else {
      audio.pause();
      $("sound-toggle").classList.remove("playing");
    }
  });
  audio.addEventListener("pause", () => $("sound-toggle").classList.remove("playing"));
  audio.addEventListener("play", () => $("sound-toggle").classList.add("playing"));
})();