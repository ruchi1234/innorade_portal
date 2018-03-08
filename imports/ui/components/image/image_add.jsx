import React from 'react';
// import { Meteor } from 'meteor/meteor';
// import { Tracker } from 'meteor/tracker';
import { Slingshot } from 'meteor/edgee:slingshot';
import { _ } from 'meteor/underscore';
import $ from 'jquery';

import { isURL } from '/imports/modules/domain_utils';
import Loader from '/imports/ui/components/loader';
import { Kadira } from 'meteor/meteorhacks:kadira';

/*
** file: client.components.image_gallery.ImageGallery
** by: MavenX - tewksbum Apr 2016
** re: Modal view to manage images associated to board or product.
** passed:
** images: [] of {}
    //   _id: simple compound string + int to identify (needed?)
    //   author: reference to where sourced
    //   href: link to image
    //   html: overload images to accept embed / videos
** ref :
** http://www.html5rocks.com/en/tutorials/file/dndfiles/
*/

const ImageAdd = React.createClass({
  propTypes: {
    handleAddImage: React.PropTypes.func.isRequired,
    images: React.PropTypes.array.isRequired,
    showSort: React.PropTypes.func,
  },

  getInitialState() {
    return {
      images: [{}],
      loading: false,
    };
  },

  componentWillMount() {
    // On initial load we want to load the initial products
    this.setState({
      images: this.props.images,
    });

    this.uploader = new Slingshot.Upload('mavenS3Uploads');
  },

  componentDidMount() {
    this.refs.iloader.addEventListener('dragover', this.handleDragover);
    this.refs.iloader.addEventListener('drop', this.handleDrop);
  },

  componentWillUnmount() {
    this.refs.iloader.removeEventListener('dragover', this.handleDragover);
    this.refs.iloader.removeEventListener('drop', this.handleDrop);
  },

  // 2-part process. When someone clicks on the drop-zone it will fire the click
  // event on the 0 opacity file input control.  Which fires uploadFile onChange.
  click() {
    this.refs.imageUpload.click();
  },

  handleDragover(e) {
    console.log(' dragover ');
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  },

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files; // Array of all files
    for (let i = 0, file; file = files[i]; i++) {
      if (file.type.match(/image.*/)) {
        this.uploadSling(file);
      }
    }
  },

  isImage(mime) {
    return _.contains(['image/jpeg', 'image/jpg', 'image/png', 'image/pdf', 'image/gif'], mime);
  },

  // handlePaste(event) {
  //   const items = (event.clipboardData || event.originalEvent.clipboardData).items;
  //   // const StopIteration = new Error('StopIteration');
  //   // for (let item of items) {
  //   // console.log("items", items);
  //   // try {
  //     _.each(items, (item) => {
  //       // console.log("item", item);
  //       if (item.kind === 'file' && this.isImage(item.type)) {
  //         const blob = item.getAsFile();
  //         this.uploadSling(blob);
  //         // event.clipboardData.clearData();
  //         // items.clear();
  //         // throw StopIteration;
  //       }
  //     // });
  //   // } catch (e) { if (e !== StopIteration) { throw e; } }
  // },

  handlePaste(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    _.each(items, (item) => {
      // console.log("item", item);
      if (item.kind === 'file' && this.isImage(item.type)) {
        const blob = item.getAsFile();
        this.uploadSling(blob);
      }
    });
  },

  pasteURL(iurl) {
    if (isURL(iurl)) {
      const imageType = iurl.substring(iurl.length - 3, iurl.length);
      // if (this.isImage(imageType)) {
      if (imageType === 'jpg' || imageType === 'png' || imageType === 'pdf'
        || imageType === 'gif') {
        const image = {
          _id: Math.floor((Math.random() * 100000) + 1),
          href: iurl,
          source: 'url',
        };
        this.updateImageArray(image);
      } else {
      Bert.alert('Please double check your URL, we only take .jpg, .png, .pdf, or .gif.',
        'warning', 'fixed-top');
      }
    } else {
      Bert.alert('Please verify that you\'ve supplied a valid URL.', 'warning', 'fixed-top');
    }
  },

  // 2nd part of onClick event.  When someone selects a file in the system file
  // select screen it should fire an onChange which calls this.
  uploadFile() {
    const file = this.refs.imageUpload.files[0];
    if (file) {
      this.uploadSling(file);
    } else {
      console.log( 'noFile' );
    }
  },

  uploadSling(file) {
    console.log('file: ', file);
    if (this.isImage(file.type)) {
      this.setState({ loading: true });
      this.uploader.send(file, (error, downloadUrl) => {
        this.setState({ loading: false });
        if (error) {
          const type = 'imageAdd';
          const message = error.message;
          Kadira.trackError(type, message);
          console.log('\n\n', message, '\n\n');
          if (error.mesasage === 'File exceeds allowed size of 30 MB [Upload denied]') {
            Bert.alert('File exceeds allowed size of 30 MB [Upload denied]', 'danger', 'fixed-top');
          }
        } else {
          const image = {
            _id: Math.floor((Math.random() * 100000) + 1),
            href: downloadUrl,
            source: 'author',
          };
          this.updateImageArray(image);
        }
      });
    } else {
      Bert.alert('File not recognized as an image.  Please try again or choose another file.', 'danger', 'fixed-top');
    }
  },

  updateImageArray(image) {
    const { handleAddImage } = this.props;
    // const _images = [
    //   image,
    //   ...images,
    // ];
    // onUpdateImages(_images);
    handleAddImage(image);
    $('#iurl').val('');
    $('#imgupload').val('');

    Bert.alert('Your image has been added.', 'success', 'fixed-top');
    if (this.props.showSort) {
      this.props.showSort();
    }
  },

  show() {
    this.refs.modal.show();
  },

  hide() {
    this.refs.modal.hide();
  },

  render() {
    const { loading } = this.state;
    return (
      <div
        className="uploads"
        onPaste={this.handlePaste}

      >
        {loading && <Loader />}
        <h4 className="modal-title30">
          Add an Image
        </h4>
        <ul>
          <li
            ref="iloader"
            className="iloader"
          >
            <img src="/img/components/maven-drag-and-drop.png" role="presentation" />
            <button onClick={this.click}>
              Choose files to upload
            </button>
            <p>
              drag or paste image from your clipboard here
            </p>
          </li>
          <li>
            <span>
              or
            </span>
          </li>
          <li>
            <span>
              Enter an image link from the web
            </span>
            <a>
              <input
                ref="iurl"
                className="input-form-control"
                placeholder="Paste image link address here..."
                type="text"
              />
            </a>
            <button onClick={() => { this.pasteURL(this.refs.iurl.value); }} >
              Add
            </button>
          </li>
        </ul>
        <input
          ref="imageUpload"
          id="imgupload"
          className="hide"
          type="file"
          onChange={this.uploadFile}
        />
      </div>
    );
  },
});

export default ImageAdd;
