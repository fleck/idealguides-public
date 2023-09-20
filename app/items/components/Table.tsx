import ct from "class-types.macro"

export default function Table() {
  return (
    <div className={ct("overflow-x-scroll")}>
      <table className={ct("text-8xl")}>
        <tbody>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
            <th>Header 3</th>
            <th>Header 4</th>
            <th>Header 5</th>
          </tr>
          <tr>
            <td>Row:1 Cell:1</td>
            <td>Row:1 Cell:2</td>
            <td>Row:1 Cell:3</td>
            <td>Row:1 Cell:4</td>
            <td>Row:1 Cell:5</td>
          </tr>
          <tr>
            <td>Row:2 Cell:1</td>
            <td>Row:2 Cell:2</td>
            <td>Row:2 Cell:3</td>
            <td>Row:2 Cell:4</td>
            <td>Row:2 Cell:5</td>
          </tr>
          <tr>
            <td>Row:3 Cell:1</td>
            <td>Row:3 Cell:2</td>
            <td>Row:3 Cell:3</td>
            <td>Row:3 Cell:4</td>
            <td>Row:3 Cell:5</td>
          </tr>
          <tr>
            <td>Row:4 Cell:1</td>
            <td>Row:4 Cell:2</td>
            <td>Row:4 Cell:3</td>
            <td>Row:4 Cell:4</td>
            <td>Row:4 Cell:5</td>
          </tr>
          <tr>
            <td>Row:5 Cell:1</td>
            <td>Row:5 Cell:2</td>
            <td>Row:5 Cell:3</td>
            <td>Row:5 Cell:4</td>
            <td>Row:5 Cell:5</td>
          </tr>
          <tr>
            <td>Row:6 Cell:1</td>
            <td>Row:6 Cell:2</td>
            <td>Row:6 Cell:3</td>
            <td>Row:6 Cell:4</td>
            <td>Row:6 Cell:5</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
