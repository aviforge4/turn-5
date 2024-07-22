document.addEventListener('DOMContentLoaded', function() {
    const videoInput = document.getElementById('videoFile');
    const videoDisplaySection = document.getElementById('videoDisplaySection');
    const uploadedVideo = document.getElementById('uploadedVideo');
    const thumbnailInput = document.getElementById('thumbnailFile');
    const thumbnailDisplaySection = document.getElementById('thumbnailDisplaySection');
    const chosenThumbnail = document.getElementById('chosenThumbnail');
    const previewButton = document.getElementById('previewVideoButton');
    const closePreviewButton = document.getElementById('closePreviewButton');
    const uploadButton = document.getElementById('uploadButton');
    const formContainer = document.querySelector('.form-container');
    const buttonContainer = document.getElementById('buttonContainer');

    let videoSelected = false;
    let thumbnailSelected = false;

    // Initially hide the preview button and other buttons
    previewButton.style.display = 'none';
    buttonContainer.style.display = 'none';

    videoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const videoURL = URL.createObjectURL(file);
            uploadedVideo.src = videoURL;
            videoDisplaySection.style.display = 'block';
            videoSelected = true;
            checkPreviewButton();
        }
    });

    thumbnailInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                chosenThumbnail.src = e.target.result;
                thumbnailDisplaySection.style.display = 'block';
                thumbnailSelected = true;
                checkPreviewButton();
            };
            reader.readAsDataURL(file);
        }
    });

    function checkPreviewButton() {
        if (videoSelected && thumbnailSelected) {
            previewButton.style.display = 'inline-block';
        }
    }

    document.getElementById('closeVideoUploadForm').addEventListener('click', function() {
        document.getElementById('videoUploadForm').style.display = 'none';
    });

    previewButton.addEventListener('click', function() {
        const title = document.getElementById('videoTitle').value;
        const description = document.getElementById('videoDescription').value;
        const tags = document.getElementById('videoTags').value;
        const location = document.getElementById('videoLocation').value;
        const dateTime = document.getElementById('videoDateTime').value;
        const category = document.getElementById('videoCategory').value;
        const privacy = document.getElementById('videoPrivacy').value;
        const Comments = document.getElementById('videoComments').value;
        const Paid = document.getElementById('videoPaid').value;
        const Ads = document.getElementById('videoAds').value;

        const shortDescription = truncateDescription(description, 2);
        const descriptionHTML = highlightLinks(shortDescription);
        const fullDescriptionHTML = highlightLinks(description);

        let previewHTML = `
            <h2 style="color: black; text-align: inherit;">${title}</h2>
            <div id="thumbnailVideoContainer" style="position: relative; display: inline-block;">
                <img id="previewThumbnail" src="${chosenThumbnail.src}" alt="Thumbnail" style="max-width: 100%; cursor: pointer;">
                <video id="previewVideo" controls src="${uploadedVideo.src}" style="display: none; max-width: 100%;"></video>
            </div>
            <p id="previewDescription" style="max-width: 100%; overflow-wrap: break-word; white-space: pre-wrap; text-align: inherit;">
                <strong id="toggleDescription" style="color: blue; cursor: pointer; display: block; text-align: left;">Description:</strong> 
            </p>
            <p id="previewFullDescription" style="display: none; max-width: 100%; overflow-wrap: break-word; white-space: pre-wrap; text-align: inherit;">
                <strong id="toggleDescriptionFull" style="color: purple; cursor: pointer; display: block; text-align: left;">Description:</strong> ${fullDescriptionHTML}
            </p>
            <p style="max-width: 100%; overflow-wrap: break-word; text-align: inherit;"><strong>Tags:</strong> ${tags}</p>
            <p style="max-width: 100%; overflow-wrap: break-word; text-align: inherit;"><strong>Location:</strong> ${location}</p>
            <p style="text-align: inherit;"><strong>Date & Time:</strong> ${dateTime}</p>
            <p style="text-align: inherit;"><strong>Category:</strong> ${category}</p>
            <p style="text-align: inherit;"><strong>Privacy:</strong> ${privacy}</p>
            <p style="text-align: inherit;"><strong>Comments:</strong> ${Comments}</p>
            <p style="text-align: inherit;"><strong>Paid:</strong> ${Paid}</p>
            <p style="text-align: inherit;"><strong>Ads:</strong> ${Ads}</p>
        `;
    

        const previewSection = document.createElement('div');
        previewSection.innerHTML = previewHTML;

        // Ensure only one preview is displayed at a time
        const existingPreview = document.getElementById('videoPreviewSection');
        if (existingPreview) {
            existingPreview.remove();
        }

        previewSection.id = 'videoPreviewSection';
        formContainer.appendChild(previewSection);

        previewButton.style.display = 'none';
        buttonContainer.style.display = 'flex';

        const previewThumbnail = document.getElementById('previewThumbnail');
        const previewVideo = document.getElementById('previewVideo');

        previewThumbnail.addEventListener('click', function() {
            previewVideo.style.display = 'block';
            previewThumbnail.style.display = 'none';
            previewVideo.play();
        });

        previewVideo.addEventListener('pause', function() {
            setTimeout(() => {
                if (previewVideo.paused) {
                    previewVideo.style.display = 'none';
                    previewThumbnail.style.display = 'block';
                }
            }, 30000); // 30 seconds
        });

        previewVideo.addEventListener('ended', function() {
            previewVideo.style.display = 'none';
            previewThumbnail.style.display = 'block';
        });

        function toggleDescription() {
            const fullDescription = document.getElementById('previewFullDescription');
            const shortDescription = document.getElementById('previewDescription');
            if (fullDescription.style.display === 'block') {
                fullDescription.style.display = 'none';
                shortDescription.style.display = 'block';
            } else {
                fullDescription.style.display = 'block';
                shortDescription.style.display = 'none';
            }
        }

        document.getElementById('toggleDescription').addEventListener('click', toggleDescription);
        document.getElementById('toggleDescriptionFull').addEventListener('click', toggleDescription);
    });

    closePreviewButton.addEventListener('click', function() {
        const previewSection = document.getElementById('videoPreviewSection');
        if (previewSection) {
            previewSection.remove();
        }
        previewButton.style.display = 'inline-block';
        buttonContainer.style.display = 'none';
    });

    function truncateDescription(description, wordLimit) {
        const words = description.split(" ");
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(" ") + "...";
        }
        return description;
    }

    function highlightLinks(text) {
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlPattern, '<a href="$1" target="_blank" style="color: blue;">$1</a>');
    }
});