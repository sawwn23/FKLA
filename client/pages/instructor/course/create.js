import { useState, useEffect } from 'react'
import axios from 'axios'
import InstructorRoute from '../../../components/routes/InstructorRoute'
import CourseCreateForm from '../../../components/forms/CourseCreateForm'
import Resizer from 'react-image-file-resizer'
import { toast } from 'react-toastify'

const CourseCreate = () => {
  // state
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    category: '',
    loading: false,
    imagePreview: '',
  })
  const [image, setImage] = useState()
  const [preview, setPreview] = useState()
  const [uploadButtonText, setuploadButtonText] = useState('Upload Image')

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    let file = e.target.files[0]
    setPreview(window.URL.createObjectURL(file))
    setuploadButtonText(file.name)
    setValues({ ...values, loading: true })

    //resize
    Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
      try {
        let { data } = await axios.post('/api/course/upload-image', {
          image: uri,
        })
        console.log('Image Upload', data)
        // set image in state
        setValues({ ...values, loading: false })
      } catch (err) {
        console.log(err)
        setValues({ ...values, loading: false })
        toast('Image Upload Failed')
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(values)
  }

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Create Course</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
        />
      </div>
      <pre>{JSON.stringify(values, null, 4)}</pre>
    </InstructorRoute>
  )
}

export default CourseCreate
