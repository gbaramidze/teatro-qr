import React from 'react';
import interact from 'interactjs';

function ImageViewer({ imageSrc, onClose }) {
  React.useEffect(() => {
    const element = document.querySelector('.draggable');
    interact(element)
      .draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ],
        autoScroll: true,
        listeners: {
          move: (event) => {
            const target = event.target;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.transform = `translate(0px, ${y}px)`;
            target.setAttribute('data-y', y);

            const opacity = Math.max(0, 1 - Math.abs(y) / 200);
            target.style.opacity = opacity;
          },
          end: (event) => {
            const target = event.target;
            const y = Math.abs(parseFloat(target.getAttribute('data-y')) || 0);
            if (y > 150) {
              onClose();
            } else {
              target.style.transform = 'translate(0px, 0px)';
              target.style.opacity = '1';
              target.setAttribute('data-y', '0');
            }
          }
        }
      });

    return () => interact(element).unset();
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-[90vw] draggable" data-y="0">
        <img
          src={imageSrc}
          alt="Enlarged item"
          className="w-full max-h-[80vh] object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-transform duration-200 transform hover:scale-110"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}

export default ImageViewer;