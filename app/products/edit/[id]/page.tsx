interface EditProductPageProps {
    params: { id: string }; // `params` is automatically passed to the page component
  }
  
  const EditProductPage = async ({ params }: EditProductPageProps) => {
    const { id } = await params; // Access the `id` from the route
  
   
  
    return (
      <div>
        <h1>Edit Product</h1>
        <p>Editing Product ID: {id}</p>
          <div>
            <label htmlFor="name">Product Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <button type="submit">Save Changes</button>
      </div>
    );
  };
  
  export default EditProductPage;
  