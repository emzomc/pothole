import Dexie from 'dexie';
import { useLiveQuery } from "dexie-react-hooks";


export const db = new Dexie('todo-photos');
db.version(1).stores({
  photos: 'id'
});

async function addPhoto(id, imgSrc) {
  console.log("addPhoto", imgSrc.length, id);
  try {
    const i = await db.photos.add({
      id: id,
      imgSrc: imgSrc
    });
    console.log(`Photo ${imgSrc.length} bytes successfully added. Got id ${i}`);
  } catch (error) {
    console.log(`Failed to add photo: ${error}`);
  }
  return <>
    <p>
      {imgSrc.length} &nbsp; | &nbsp; {id}
    </p>
  </>
}

function GetPhotoSrc(id) {
  //console.log("getPhotoSrc", id);
  const img = useLiveQuery(
    () => db.photos.where('id').equals(id).toArray()
  );

  var photoUpload = "";
  try {
    photoUpload = img[0].imgSrc;
  } catch (error) {
    console.error("Something bad happened");
    console.error(error);
    photoUpload = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  }
  return photoUpload;
}

//DELETE ORPHAN IMAGES
async function deleteImage(id) {
  try {
    await db.photos.where('id').equals(id).delete();
  } catch (error) {
    console.log('Failed to delete photo');
  }
}


export { addPhoto, GetPhotoSrc, deleteImage }