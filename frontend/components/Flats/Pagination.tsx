export default function Pagination({
  page,
  totalPages,
  setPage
}:any){

  return(

    <div className="flex justify-center gap-3 mt-6">

      <button
        disabled={page===1}
        onClick={()=>setPage(page-1)}
        className="border px-3 py-1"
      >
        Prev
      </button>

      <span>
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page===totalPages}
        onClick={()=>setPage(page+1)}
        className="border px-3 py-1"
      >
        Next
      </button>

    </div>

  )

}