try {
    if (!'MediaSource' in window)
        throw new ReferenceError('There is no MediaSource property in window object.');

    var mime = 'audio/mpeg';

    if (!MediaSource.isTypeSupported(mime)) {
        alert('Can not play the media. Media of MIME type ' + mime + ' is not supported.');
        throw ('Media of type ' + mime + ' is not supported.');
    }

    var audio = document.querySelector('audio'),
        mediaSource = new MediaSource();
    	
    audio.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', function() {
        var sourceBuffer = this.addSourceBuffer(mime);
        sourceBuffer.appendWindowEnd = 4.0;
        var xhr = new XMLHttpRequest;
        xhr.open('GET', 'https://raw.githubusercontent.com/rpsthecoder/mediasourceapi/master/sample.mp3');
        // xhr.open('GET', 'sample.mp3'); /* while testing in localhost */
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            try {
                switch (this.status) {
                    case 200:
                        sourceBuffer.appendBuffer(this.response);
                        sourceBuffer.addEventListener('updateend', function (_) {
                            mediaSource.endOfStream();
                        });
                        break;
                    case 404:
                        throw 'File Not Found';
                    default:
                        throw 'Failed to fetch the file';
                }
            } catch (e) {
                console.error(e);
            }
        };
        xhr.send();
    });
} catch (e) {
    console.error(e);
}
