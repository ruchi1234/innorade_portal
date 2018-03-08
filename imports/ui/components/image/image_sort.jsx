import React from 'react';

import Row from '/imports/ui/components/grid/row';
import Col from '/imports/ui/components/grid/col';

import Img from '/imports/ui/components/img';


const ImageSort = React.createClass({
  propTypes: {
    images: React.PropTypes.array.isRequired,
    collection: React.PropTypes.object,
    doc: React.PropTypes.object,
  },

  mixins: [SortableMixin],

  onUpdate(evt) {
    const { newIndex, oldIndex } = evt;
    const { doc } = this.props;
    doc.getCollection().api.moveImage.call({ _id: doc._id, newIndex, oldIndex });
  },

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
    const { doc, images } = this.props;

    return (
      <section
        className="imageSort"
      >
        <h4>Arrange Images</h4>
        <p>Add, re-order or delete images below</p>
        <ul ref="images" className="sortable">
          {images.map((i, index) => {
            const removeImage = () => {
              const yes = confirm('Are you sure you would like to remove this image ' +
                'from the user?');
              if (yes) {
                doc.getCollection().api.removeImage.call({ _id: doc._id, imageHref: i.href });
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
                    <Img src={i.href} height={98} />
                  </Col>
                  <Col>
                    <span
                      onClick={removeImage}>
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


// This should move to komposer.  Remove images processing from here
// and use login state for user id
const ImageSortWData = MeteorData(ImageSort, {
  getData(props) {
    const doc = props.doc;
    const images = doc && doc.images || doc && doc.profile && doc.profile.images || [];
    /*
     * _.forEach(doc && doc.images || doc && doc.profile && doc.profile.images, (i) => {
      if (i.author === cusrId) {
        _images.push(i);
      }
      });
    */

    return {
      doc,
      images,
      type: props.type,
    };
  },
});

export default ImageSortWData;
