const _root = require('./artefact/build.node')

class ContainerImage {
    inner;

    constructor(imagePath) {
        this.inner = _root.binding__containerimg_new(imagePath);
    }

    async extract() {
        await _root.binding__containerimg_extract.call(this.inner);
    }

    async verify() {
        return await _root.binding__containerimg_verify.call(this.inner);
    }
}

class ContainerEngine {
    inner;

    imageOptions;
    image;
    submissionPath;

    constructor(imageOptions, image, submissionPath) {
        this.imageOptions = imageOptions;
        this.image = image;
        this.submissionPath = submissionPath;
    }

    async init() {
        await _root.binding__containerengine_new(this.imageOptions, this.image.inner, this.submissionPath);
    }

    async waitForOutput() {
        return await _root.binding__containerengine_waitcompletion.call(this.inner);
    }

    async getResults() {
        return await _root.binding__containerengine_testoutput.call(this.inner);
    }
}

module.exports = {
    ContainerImage,
    ContainerEngine,
}
