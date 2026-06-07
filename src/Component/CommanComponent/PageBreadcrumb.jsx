import { ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";

const PageBreadcrumb = ({ pageTitle }) => {
  return (
    <div className="w-full bg-gray-50 border border-gray-100 rounded-xl mb-4">
      <div className="container mx-auto px-4 py-3">
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link className="inline-flex items-center gap-1.5 text-sm text-black" to="/">
                Home
              </Link>
            </li>
            <li>
              <ChevronsRight className="w-4 h-4 text-gray-600" />
            </li>
            <li className="text-sm font-medium text-gray-700 capitalize">{pageTitle}</li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default PageBreadcrumb;
