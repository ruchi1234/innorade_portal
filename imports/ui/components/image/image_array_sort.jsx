import React from 'react';

import Row from '/imports/ui/components/grid/row';
import Col from '/imports/ui/components/grid/col';

import Img from '/imports/ui/components/img';


const ImageArraySort = React.createClass({
  propTypes: {
    images: React.PropTypes.array.isRequired,
    onUpdateImages: React.PropTypes.func.isRequired,
    // removeBarImage: React.PropTypes.func.isRequired,
    // moveBarImage: React.PropTypes.func.isRequired,
  },

  mixins: [SortableMixin],

  onUpdate(evt) {
    const { newIndex, oldIndex } = evt;
    const { images } = this.props;
    const imgz = images.slice(0);
    const myimage = imgz.splice(oldIndex, 1);
    imgz.splice(newIndex, 0, myimage[0]);
    this.props.onUpdateImages(imgz);
    // this.props.moveBarImage(newIndex, oldIndex);
    // this.setState({
    //   images: _images,
    // });
  },

  removeBarImage(params) {
    const imgz = this.props.images;
    imgz.splice(params, 1);
    this.props.onUpdateImages(imgz);
    // this.setState({
    //   images,
    // });
  },

  // moveBarImage(newIndex, oldIndex) {
  //   const { images } = this.state;
  //   const _images = images.slice(0);
  //   const myimage = _images.splice(oldIndex, 1);
  //   _images.splice(newIndex, 0, myimage[0]);
  //   this.setState({
  //     images: _images,
  //   });
  // },

  /*
   * Define options for the sortable plugin
   */
  sortableOptions: {
    ref: 'images',
    model: 'images',
    onEnd: 'onEnd',
    onUpdate: 'onUpdate',
    ghostClass: 'sortable-ghost',  // Class name for the drop placeholder
    chosenClass: 'sortable-chosen',
  },

  render() {
    const { images } = this.props;

    return (
      <section
        className="imageSort"
      >
        <h4>Arrange Images</h4>
        <p>Add, re-order or delete images below</p>
        <ul ref="images" className="sortable">
          {(images || []).map((i, index) => {
            const removeImage = () => {
              const yes = confirm('Are you sure you would like to remove this image ' +
                'from the user?');
              if (yes) {
                this.removeBarImage(index);
              }
            };
            return (
              <li
                key={index}
                data-boardproduct-image-href={i.href}
                className="product-sort-list-item"
              >
                <Row>
                  <Col>
                    <i className="fa fa-th" aria-hidden="true"></i>
                  </Col>
                  <Col>
                    <Img src={i.href} />
                  </Col>
                  <Col>
                    <span
                      onClick={removeImage}
                    >
                      <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </span>
                  </Col>
                </Row>
              </li>
            );
          })}
        </ul>
      </section>
    );
  },
});

export default ImageArraySort;
