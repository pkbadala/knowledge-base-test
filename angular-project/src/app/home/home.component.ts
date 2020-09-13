import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../common/commonComponent';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

// environment
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {

  public productListing: any;
  public categoryListing: any;
  public productAllDetail: any;
  public totalProducts: number;
  public pageNumber: number = 1;
  public pageSize: number = 10;
  public token: string;
  public imgURL: string;
  public deleteProductId: string = "";
  public editProductId: string = "";
  public uploadProductImgURL: string;

  public loginForm: FormGroup;
  public addProductForm: FormGroup;
  public addCategoryForm: FormGroup;
  public searchForm: FormGroup;
  public filterForm: FormGroup;
  public userForm: FormGroup;

  public productSubmitted = false;

  public data = {
    "pageNumber": this.pageNumber,
    "pageSize": this.pageSize
  };

  constructor(public injector: Injector, private formBuilder: FormBuilder, private toaster: ToastrService) { 
    super(injector);
    
    this.imgURL = environment.imageUrl;

    this.addCategoryForm = this.formBuilder.group({
      categoryName: ['', [Validators.required]]
    });

    this.searchForm = this.formBuilder.group({      
      searchKeyword: ['', [Validators.required]],
    });

    this.filterForm = this.formBuilder.group({      
      categoryId: [''],
    });

    this.addProductForm = this.formBuilder.group({
      productName: ['', [Validators.required ]],
      productDescription: ['', [Validators.required ]],
      categoryId: ['', [Validators.required ]],
      productImage: ['']
    });

    this.userForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      userId: ['', [Validators.required]]
    });

    this.token = this.getToken('authToken');
    this.getCategoryList();
  }

  ngOnInit() {
    this.commonService.callApi('getAllProduct', this.data, 'post', false).then(response => {
      if(response.status === 1) {
        this.productListing = response.data;
        this.totalProducts = response.totalProducts;
      }
    });
  }

  getCategoryList() {
    this.commonService.callApi('getAllCategory', {}, 'get', false).then(response => {
      if(response.status === 1) {
        this.categoryListing = response.categoryList;
      }
    });
  }

  // set pagination
  pagination(type) {
    if(type === 'prev') {
      if(this.pageNumber > 1) {
        this.pageNumber--;
        this.ngOnInit();
      }
    } else if(type === 'next') {
      if(this.totalProducts > (this.pageNumber * this.pageSize)) {
        this.pageNumber++;
        this.ngOnInit();
      }
    }
  }

  // Add new category
  addNewCategory() {
    let formValid = this.checkAllRequiredFieldValues(this.addCategoryForm.value, 'Save New Product');
    if(formValid) {
      this.commonService.callApi('saveCategory/', this.addCategoryForm.value, 'post', false).then(response => {
        if(response.status === 1) {
          this.toaster.success(response.message, 'Save New Product');
          $('#categoryModal').modal('hide');
          this.addCategoryForm.reset();
          this.getCategoryList();
        } else {
          this.toaster.error(response.message, 'Save New Product');
        }
      });
    }
  }

  // Add new product
  addNewProduct() {
    this.addProductForm.controls.productImage.setValue(this.uploadProductImgURL);

    let formValid = this.checkAllRequiredFieldValues(this.addProductForm.value, 'Save New Product');
    if(formValid) {
      if(this.productAllDetail && this.productAllDetail._id) {
        this.addProductForm.value["productId"] = this.productAllDetail._id;
        this.commonService.callApi('editProduct/', this.addProductForm.value, 'put', false).then(response => {
          if(response.status === 1) {
            this.uploadProductImgURL = null;
            this.toaster.success(response.message, 'Edit Product');
            $('#addProductModal').modal('hide');
            this.ngOnInit();
            this.addProductForm.reset();
            this.editProductId = "";
          } else {
            this.toaster.error(response.message, 'Edit Product');
          }
        });
      } else {
        this.commonService.callApi('saveProduct/', this.addProductForm.value, 'post', false).then(response => {
          if(response.status === 1) {
            this.uploadProductImgURL = null;
            this.toaster.success(response.message, 'Save New Product');
            $('#addProductModal').modal('hide');
            this.ngOnInit();
            this.addProductForm.reset();
          } else {
            this.toaster.error(response.message, 'Save New Product');
          }
        });
      }
    }
  }

  // hold edit product ID
  editProductById(productId) {
    this.editProductId = productId;

    this.commonService.callApi('getProductDetail/' + this.editProductId, {}, 'get', false).then(response => {

      $('#addProductModal').modal('show');
      if(response.data.productImage) {
        this.uploadProductImgURL = response.data.productImage;
      }
      this.addProductForm.setValue({
        productName: response.data.productName,
        productDescription: response.data.productDescription,
        categoryId: response.data.categoryId,
        productImage: response.data.productImage
      });
      this.productAllDetail = response.data;
    });
  }

  // delete use particular product
  deleteProduct() {
    if(this.deleteProductId) {
      this.commonService.callApi('deleteProduct/' + this.deleteProductId, {}, 'delete', false).then(response => {
        if(response.status === 1) {
          this.toaster.success(response.message, 'Delete Product');
          $('#deleteProductModal').modal('hide');
          this.deleteProductId = "";
          this.ngOnInit();
        } else {
          this.toaster.error(response.message, 'Delete Product');
        }
      });
    } else {
      this.toaster.error('Please select any post', 'Delete Product');
    }
  }

  // hold deleted product ID
  deleteProductById(productId) {
    this.deleteProductId = productId;
    $('#deleteProductModal').modal('show');
  }

  // check all required data is fill or not
  checkAllRequiredFieldValues(data, title) {
    const keyArr = Object.keys(data);
    const valueArr = Object.values(data);

    for (let i = 0; i < keyArr.length; i++) {
      if (valueArr[i] === null || valueArr[i] === '' || valueArr[i] === false) {

        keyArr[i] = keyArr[i].replace(/([A-Z])/g, ' $1').trim().toLowerCase();
        keyArr[i] = keyArr[i].replace('required', '');
        this.toaster.error(keyArr[i] + ' field is required', title);
        return false;
      }
    }
    return true;
  }

  filterProduct() {
    this.data["filterByCategory"] = this.filterForm.value.categoryId;
    this.ngOnInit();
  }
  
  searchPost() {
    let formValid = this.checkAllRequiredFieldValues(this.searchForm.value, 'Search Product');
    if(formValid && this.searchForm.value.searchKeyword) {
      this.data["searchKeyword"] = this.searchForm.value.searchKeyword;
      this.ngOnInit();
    }
  }

  loadAllProduct() {
    delete this.data["searchKeyword"];
    delete this.data["filterByCategory"];
    this.ngOnInit();
  }

  loadUserDetail() {
    let userId = this.getDataInLS('userId');
    if(userId) {
      this.commonService.callApi('getUserDetail/' + userId, {}, 'get', false).then(response => {
        this.userForm.setValue({
          userName: response.data.userName,
          email: response.data.email,
          userId: response.data.userId
       });
      });
    }
  }

  saveUserDetail() {
    let userId = this.getDataInLS('userId');
    let data = {
      "userName": this.userForm.value.userName,
      "userId" : userId
    };

    this.commonService.callApi('updateUserDetail', data, 'put', false).then(response => {
      if(response.status === 1) {
        this.toaster.success(response.message, 'Save user detail');
        $('#userProfileModal').modal('hide');
        this.userForm.reset();
      } else {
        this.toaster.error(response.message, 'Save user detail');
      }
    });
  }

  uploadFile(event) {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    
    this.commonService.callImageUploadApi('fileUpload', formData, 'post').then(response => {
      if(response.status === 1) {
        this.uploadProductImgURL = response.data.filePath;
      } else {
        this.toaster.error(response.message, 'Upload Image');
      }
    });
  }
}
