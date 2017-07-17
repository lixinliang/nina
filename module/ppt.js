'use strict';

const path = require('path');
const PPT = require('ppt-template');
const { Presentation, Slide } = PPT;

module.exports = function ( excel, filename, output ) {
    return new Promise(( resolve, reject ) => {
        let ppt = new Presentation();
        ppt.loadFile(filename).then(() => {
            let length = ppt.getSlideCount();
            let slides = Array.apply(null, { length }).map(( value, index ) =>
                ppt.getSlide(index + 1).clone()
            );

            slides.forEach(( slide ) => {
                slide.fillAll(excel);
            });

            ppt.generate(slides).then(( clone ) => {
                clone
                .saveAs(path.join(output, 'output.pptx'))
                .then(resolve)
                .catch(reject);
            }).catch(reject);
        }).catch(reject);
    });
};

module.exports.test = function ( filename, output ) {
    let ppt = new Presentation();
    ppt.loadFile(filename).then(() => {
        console.log('ppt read file success');
        let length = ppt.getSlideCount();
        console.log(`ppt slide length: ${ length }`);
        let slides = Array.apply(null, { length }).map(( value, index ) =>
            ppt.getSlide(index + 1).clone()
        );
        slides[0].fillAll([
			Slide.pair('[Title]', 'Hello PPT'),
		]);
        ppt.generate(slides).then(( clone ) => {
            clone
            .saveAs(path.join(output, 'output.pptx'))
            .then(() => {
                console.log('done');
            }).catch(( err ) => console.log(err));
        }).catch(( err ) => console.log(err));
    }).catch(( err ) => console.log(err));
};
