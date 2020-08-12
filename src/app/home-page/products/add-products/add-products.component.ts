import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HomePageService } from "../../home-page.service";

@Component({
  selector: "app-add-products",
  templateUrl: "./add-products.component.html",
  styleUrls: ["./add-products.component.css"],
})
export class AddProductsComponent implements OnInit {
  productForm: FormGroup;
  selectedFile: File = null;
  productAddedStatus = false;
  productAddedMassage = "";
  singleProduct: any;
  editMode = false;
  imgValue = "";
  sku: number;

  products: any;
  productsCopy: any;
  productSearch: string;
  myProducts = [];

  constructor(private homePageService: HomePageService) {}

  ngOnInit(): void {
    this.onAddProduct();
    this.onGetAllProducts();
  }

  private onAddProduct() {
    this.productForm = new FormGroup({
      productName: new FormControl("", Validators.required),
      categoryId: new FormControl("", Validators.required),
      price: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
      img: new FormControl("", Validators.required),
    });
  }

  categorySwitchCase() {
    let category: number;
    switch (this.productForm.get("categoryId").value) {
      case "Milk & Eggs":
        category = 111;
        break;
      case "Vegettables & Fruits":
        category = 222;
        break;
      case "Meet & Fish":
        category = 333;
        break;
      case "Wine & Drinks":
        category = 444;
        break;

      default:
        break;
    }
    return category;
  }

  onAddImage() {
    const fd = new FormData();
    fd.append("img", this.selectedFile, this.selectedFile.name);
    return this.homePageService.addProductImg(fd);
  }

  onSubmit() {
    var category = this.categorySwitchCase();
    var newProduct = {
      name: this.productForm.value.productName,
      categoryId: category,
      price: this.productForm.value.price,
      img: "",
    };
    this.onAddImage().subscribe(
      (res) => {
        newProduct.img = res["path"];
        this.homePageService.addProduct(newProduct).subscribe((res) => {
          this.productAddedStatus = true;
          this.productAddedMassage = res["status"];
        });
      },
      (error) => {
        console.log(error);
      }
    );
    this.productForm.reset();
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  onChange() {
    this.productAddedStatus = false;
  }

  onDataForEdit(i) {
    this.editMode = true;
    let selectedProduct = this.products[i];
    switch (this.products[i].category_id) {
      case 111:
        this.productForm.get("categoryId").setValue("Milk & Eggs");
        break;
      case 222:
        this.productForm.get("categoryId").setValue("Vegettables & Fruits");
        break;
      case 333:
        this.productForm.get("categoryId").setValue("Meet & Fish");
        break;
      case 444:
        this.productForm.get("categoryId").setValue("Wine & Drinks");
        break;
      default:
        break;
    }
    this.productForm.get("productName").setValue(selectedProduct.product_name);
    this.productForm.get("price").setValue(selectedProduct.price);
    this.imgValue = selectedProduct.img;
    this.sku = selectedProduct.product_id;
  }

  onAddMode() {
    this.editMode = false;
    this.productForm.reset();
  }

  onEditProduct() {
    var editProduct;
    var category = this.categorySwitchCase();
    if (this.selectedFile === null) {
      editProduct = {
        name: this.productForm.value.productName,
        categoryId: category,
        price: this.productForm.value.price,
        img: this.imgValue,
        sku: this.sku,
      };
      this.homePageService.editProduct(editProduct).subscribe(
        (res) => {
          this.productAddedStatus = true;
          this.productAddedMassage = res["status"];
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.onAddImage().subscribe((res) => {
        editProduct = {
          name: this.productForm.value.productName,
          categoryId: category,
          price: this.productForm.value.price,
          img: res["path"],
          sku: this.sku,
        };
        this.homePageService.editProduct(editProduct).subscribe(
          (res) => {
            this.productAddedStatus = true;
            this.productAddedMassage = res["status"];
          },

          (error) => {
            console.log(error);
          }
        );
      });
    }
    this.productForm.reset();
  }

  onGetProductsByCategoryId(categoryId) {
    this.homePageService.getProductsByCategoryId(categoryId).subscribe(
      (data) => {
        this.products = data;
        this.productsCopy = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onGetAllProducts() {
    this.homePageService.getAllProducts().subscribe(
      (data) => {
        this.products = data;
        this.productsCopy = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSearch() {
    if (this.productSearch == "") {
      this.products = this.productsCopy;
    } else {
      this.products = this.productsCopy.filter((product) => {
        return product.product_name.includes(
          this.productSearch.charAt(0).toUpperCase() +
            this.productSearch.slice(1)
        );
      });
    }
  }
}
