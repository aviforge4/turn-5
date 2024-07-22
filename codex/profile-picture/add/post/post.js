document.addEventListener('DOMContentLoaded', function () {
    let currentPlayingMedia = null;

    // Open post section and hide other sections
    document.getElementById('addPost').addEventListener('click', function () {
        document.getElementById('shortSection').style.display = 'none';
        document.getElementById('postSection').style.display = 'block';
    });

    // Close post section
    document.querySelector('.close-post-icon').addEventListener('click', function () {
        document.getElementById('postSection').style.display = 'none';
    });

    // Initialize Swiper for selected media
    const swiper = new Swiper('.swiper-container', {
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            type: 'bullets',
            dynamicBullets: true,
            dynamicMainBullets: 5,
        },
    });

    // Choose photos and videos
    document.getElementById('postFile').addEventListener('change', function (event) {
        displaySelectedMedia(event, swiper);
    });

    // Choose music
    document.getElementById('postMusicFile').addEventListener('change', function (event) {
        displaySelectedMusic(event);
    });

    // Preview button functionality
    document.getElementById('previewPostButton').addEventListener('click', function () {
        previewPost(swiper);
    });

    function displaySelectedMedia(event, swiper) {
        const swiperWrapper = document.getElementById('uploadedPostMedia');
        const postDisplaySection = document.getElementById('postDisplaySection');
        const previewButton = document.getElementById('previewPostButton');
        const files = event.target.files;

        // Check if any new files are selected
        if (files.length > 0) {
            swiperWrapper.innerHTML = ''; // Clear existing images
            postDisplaySection.style.display = 'block'; // Show the container

            Array.from(files).forEach(file => {
                const swiperSlide = document.createElement('div');
                swiperSlide.classList.add('swiper-slide');
                const mediaElement = document.createElement(file.type.startsWith('video/') ? 'video' : 'img');
                mediaElement.src = URL.createObjectURL(file);
                if (file.type.startsWith('video/')) {
                    mediaElement.controls = true;
                    mediaElement.setAttribute('controlsList', 'nodownload'); // Ensure no download option is shown
                    mediaElement.addEventListener('play', () => handleMediaPlay(mediaElement));
                }
                mediaElement.setAttribute('oncontextmenu', 'return false'); // Disable right-click
                swiperSlide.appendChild(mediaElement);
                swiperWrapper.appendChild(swiperSlide);
            });

            swiper.update(); // Update Swiper with new slides
            previewButton.style.display = 'block'; // Show the preview button
        } else {
            postDisplaySection.style.display = 'none'; // Hide the container if no files are selected
            previewButton.style.display = 'none'; // Hide the preview button if no files are selected
        }
    }

    function displaySelectedMusic(event) {
        const musicPlayer = document.getElementById('uploadedPostMusic');
        const postMusicDisplaySection = document.getElementById('postMusicDisplaySection');
        const previewButton = document.getElementById('previewPostButton');
        const file = event.target.files[0];

        if (file) {
            musicPlayer.src = URL.createObjectURL(file);
            postMusicDisplaySection.style.display = 'block';
            musicPlayer.setAttribute('controlsList', 'nodownload'); // Ensure no download option is shown
            musicPlayer.setAttribute('oncontextmenu', 'return false'); // Disable right-click
            musicPlayer.addEventListener('play', () => handleMediaPlay(musicPlayer));
            previewButton.style.display = 'block'; // Show the preview button
        } else {
            postMusicDisplaySection.style.display = 'none';
            previewButton.style.display = 'none'; // Hide the preview button if no files are selected
        }
    }

    function handleMediaPlay(mediaElement) {
        // Pause the currently playing media if it's different from the one being played
        if (currentPlayingMedia && currentPlayingMedia !== mediaElement) {
            currentPlayingMedia.pause();
        }
        // Set the new media element as the currently playing media
        currentPlayingMedia = mediaElement;
    }

    function previewPost(swiper) {
        const postPreviewContainer = document.getElementById('postPreviewContainer');
        const postMusicDisplaySection = document.getElementById('postMusicDisplaySection');
        const musicPlayer = document.getElementById('uploadedPostMusic');
        const files = document.getElementById('postFile').files;

        postPreviewContainer.innerHTML = ''; // Clear previous preview content
        postPreviewContainer.style.display = 'block'; // Show the preview container

        const previewSection = document.createElement('div');
        previewSection.classList.add('swiper-container');
        previewSection.classList.add('preview-section');

        const previewWrapper = document.createElement('div');
        previewWrapper.classList.add('swiper-wrapper');

        // SCENARIO 1 & 2: Images and music selected
        if (files.length > 0 && postMusicDisplaySection.style.display === 'block') {
            Array.from(files).forEach(file => {
                const swiperSlide = document.createElement('div');
                swiperSlide.classList.add('swiper-slide');
                const mediaContainer = document.createElement('div');
                mediaContainer.classList.add('media-container');

                if (file.type.startsWith('video/')) {
                    const videoElement = document.createElement('video');
                    videoElement.src = URL.createObjectURL(file);
                    videoElement.controls = true;
                    videoElement.setAttribute('controlsList', 'nodownload');
                    videoElement.setAttribute('oncontextmenu', 'return false');
                    videoElement.addEventListener('play', () => handleMediaPlay(videoElement));
                    mediaContainer.appendChild(videoElement);
                } else if (file.type.startsWith('image/')) {
                    const imageElement = document.createElement('img');
                    imageElement.src = URL.createObjectURL(file);
                    imageElement.setAttribute('oncontextmenu', 'return false');

                    // Create audio player for image
                    const audioElement = document.createElement('audio');
                    audioElement.src = musicPlayer.src;
                    audioElement.controls = true;
                    audioElement.setAttribute('controlsList', 'nodownload');
                    audioElement.style.width = '100%';

                    // Attach event listeners to image for play/pause
                    imageElement.addEventListener('click', () => {
                        if (audioElement.paused) {
                            audioElement.play();
                        } else {
                            audioElement.pause();
                        }
                    });
                    audioElement.addEventListener('play', () => handleMediaPlay(audioElement));

                    mediaContainer.appendChild(imageElement);
                    mediaContainer.appendChild(audioElement);
                }

                swiperSlide.appendChild(mediaContainer);
                previewWrapper.appendChild(swiperSlide);
            });
        }

        // SCENARIO 3: Only images selected
        if (files.length > 0 && postMusicDisplaySection.style.display === 'none') {
            Array.from(files).forEach(file => {
                const swiperSlide = document.createElement('div');
                swiperSlide.classList.add('swiper-slide');
                const mediaContainer = document.createElement('div');
                mediaContainer.classList.add('media-container');

                if (file.type.startsWith('image/')) {
                    const imageElement = document.createElement('img');
                    imageElement.src = URL.createObjectURL(file);
                    imageElement.setAttribute('oncontextmenu', 'return false');
                    mediaContainer.appendChild(imageElement);
                }

                swiperSlide.appendChild(mediaContainer);
                previewWrapper.appendChild(swiperSlide);
            });
        }

        previewSection.appendChild(previewWrapper);

        // Add pagination to the preview Swiper
        const previewPagination = document.createElement('div');
        previewPagination.classList.add('swiper-pagination');
        previewSection.appendChild(previewPagination);

        postPreviewContainer.appendChild(previewSection);

        // Initialize Swiper for preview section with dynamic bullets
        new Swiper('.preview-section', {
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                type: 'bullets',
                dynamicBullets: true,
                dynamicMainBullets: 5,
            },
        });

        scrollToPreview();
    }

    function scrollToPreview() {
        const previewButton = document.getElementById('previewPostButton');
        const postPreviewContainer = document.getElementById('postPreviewContainer');
        postPreviewContainer.style.marginTop = '20px'; // Adjust the margin as needed
        previewButton.insertAdjacentElement('afterend', postPreviewContainer);
    }
});
